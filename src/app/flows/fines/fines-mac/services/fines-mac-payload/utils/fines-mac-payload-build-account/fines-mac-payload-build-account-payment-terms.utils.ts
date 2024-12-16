import { IFinesMacPaymentTermsState } from '../../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { IFinesMacPayloadBuildAccountPaymentTermsEnforcement } from './interfaces/fines-mac-payload-build-account-payment-terms-enforcement.interface';
import { IFinesMacPayloadBuildAccountPaymentTermsEnforcementResultResponse } from './interfaces/fines-mac-payload-build-account-payment-terms-enforcement-result-response.interface';
import { IFinesMacPayloadBuildAccountPaymentTerms } from './interfaces/fines-mac-payload-build-account-payment-terms.interface';

/**
 * Builds an enforcement response object for fines MAC payment terms.
 *
 * @param parameterName - The name of the parameter to be included in the response.
 * @param response - The response value, which can be a string or null.
 * @returns An object conforming to the `IFinesMacPaymentTermsEnforcementResultResponse` interface,
 *          containing the parameter name and the response.
 */
const buildEnforcementResultResponse = (
  parameterName: string,
  response: string | null,
): IFinesMacPayloadBuildAccountPaymentTermsEnforcementResultResponse => {
  return {
    parameter_name: parameterName,
    response: response ?? null,
  };
};

/**
 * Builds an enforcement object for fines MAC payment terms.
 *
 * @param resultId - The unique identifier for the result.
 * @param enforcementResponses - An array of enforcement result responses or null.
 * @returns An object representing the enforcement details.
 */
const buildEnforcement = (
  resultId: string,
  enforcementResponses: IFinesMacPayloadBuildAccountPaymentTermsEnforcementResultResponse[] | null,
): IFinesMacPayloadBuildAccountPaymentTermsEnforcement => {
  return {
    result_id: resultId,
    enforcement_result_responses: enforcementResponses,
  };
};

const buildPaymentTermEnforcements = (
  paymentTermsState: IFinesMacPaymentTermsState,
): IFinesMacPayloadBuildAccountPaymentTermsEnforcement[] | null => {
  const {
    fm_payment_terms_collection_order_made: hasCollectionOrderBeenMade,
    fm_payment_terms_collection_order_made_today: hasCollectionOrderBeenMadeToday,
    fm_payment_terms_enforcement_action: enforcementAction,
    fm_payment_terms_earliest_release_date: earliestReleaseDate,
    fm_payment_terms_prison_and_prison_number: prisonAndPrisonNumber,
    fm_payment_terms_reason_account_is_on_noenf: reasonAccountIsOnNoenf,
    fm_payment_terms_hold_enforcement_on_account: holdEnforcementOnAccount,
  } = paymentTermsState;

  const enforcements = [];

  if (!hasCollectionOrderBeenMade && hasCollectionOrderBeenMadeToday) {
    enforcements.push(buildEnforcement('COLLO', null));
  }

  const enforcementActionType = holdEnforcementOnAccount ? 'NOENF' : enforcementAction;

  switch (enforcementActionType) {
    case 'PRIS':
      enforcements.push(
        buildEnforcement('PRIS', [
          buildEnforcementResultResponse('earliestreleasedate', earliestReleaseDate ?? null),
          buildEnforcementResultResponse('prisonandprisonnumber', prisonAndPrisonNumber ?? null),
        ]),
      );
      break;
    case 'NOENF':
      enforcements.push(
        buildEnforcement('NOENF', [buildEnforcementResultResponse('reason', reasonAccountIsOnNoenf ?? null)]),
      );
      break;
  }

  return enforcements.length ? enforcements : null;
};

/**
 * Builds the payment terms object based on the provided payment terms state.
 *
 * @param paymentTermsState - The state object containing payment terms information.
 * @returns An object representing the payment terms.
 *
 */
export const finesMacPayloadBuildAccountPaymentTerms = (
  paymentTermsState: IFinesMacPaymentTermsState,
): IFinesMacPayloadBuildAccountPaymentTerms => {
  const {
    fm_payment_terms_payment_terms,
    fm_payment_terms_pay_by_date,
    fm_payment_terms_start_date,
    fm_payment_terms_instalment_period,
    fm_payment_terms_lump_sum_amount,
    fm_payment_terms_instalment_amount,
    fm_payment_terms_default_days_in_jail,
  } = paymentTermsState;

  let paymentTermsTypeCode = null;
  let effectiveDate = null;

  if (fm_payment_terms_payment_terms) {
    paymentTermsTypeCode = fm_payment_terms_payment_terms === 'payInFull' ? 'B' : 'I';
    effectiveDate = paymentTermsTypeCode === 'B' ? fm_payment_terms_pay_by_date : fm_payment_terms_start_date;
  }

  return {
    payment_terms_type_code: paymentTermsTypeCode,
    effective_date: effectiveDate ?? null,
    instalment_period: fm_payment_terms_instalment_period ?? null,
    lump_sum_amount: fm_payment_terms_lump_sum_amount ?? null,
    instalment_amount: fm_payment_terms_instalment_amount ?? null,
    default_days_in_jail: fm_payment_terms_default_days_in_jail ?? null,
    enforcements: buildPaymentTermEnforcements(paymentTermsState),
  };
};
