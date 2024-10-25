import { FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS } from '../../../fines-mac-payment-terms/constants/fines-mac-payment-terms-frequency-options';
import { IFinesMacPaymentTermsState } from '../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';
import { IFinesMacPaymentTermsEnforcementPayload } from '../interfaces/fines-mac-payment-terms-enforcement-payload.interface';
import { IFinesMacPaymentTermsEnforcementResultResponsePayload } from '../interfaces/fines-mac-payment-terms-enforcement-result-response-payload.interface';
import { IFinesMacPaymentTermsPayload } from '../interfaces/fines-mac-payment-terms-payload.interface';

// TODO: Remove after https://tools.hmcts.net/jira/browse/PO-909
const getInstallmentPeriod = (installmentPeriod: string | null | undefined): string | null => {
  switch (installmentPeriod?.toLocaleLowerCase()) {
    case FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS.weekly.toLowerCase():
      return 'W';
    case FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS.fortnightly.toLowerCase():
      return 'F';
    case FINES_MAC_PAYMENT_TERMS_FREQUENCY_OPTIONS.monthly.toLowerCase():
      return 'M';
    default:
      return null;
  }
};

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
): IFinesMacPaymentTermsEnforcementResultResponsePayload => {
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
  enforcementResponses: IFinesMacPaymentTermsEnforcementResultResponsePayload[] | null,
): IFinesMacPaymentTermsEnforcementPayload => {
  return {
    result_id: resultId,
    enforcement_result_responses: enforcementResponses,
  };
};

// TODO: Refactor once changes have been made
// https://tools.hmcts.net/jira/browse/PO-906
// https://tools.hmcts.net/jira/browse/PO-907
// https://tools.hmcts.net/jira/browse/PO-908
//
const buildPaymentTermEnforcements = (
  paymentTermsState: IFinesMacPaymentTermsState,
): IFinesMacPaymentTermsEnforcementPayload[] | null => {
  const enforcements = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hasCollectionOrderBeenMade: any = paymentTermsState['fm_payment_terms_collection_order_made'];
  const hasCollectionOrderBeenMadeToday = paymentTermsState['fm_payment_terms_collection_order_made_today'];
  // const addColloEnforcement = !hasCollectionOrderBeenMade && hasCollectionOrderBeenMadeToday;
  // Temporary until value is set to

  const addColloEnforcement = hasCollectionOrderBeenMade === 'no' && hasCollectionOrderBeenMadeToday;
  let resultId = null;
  if (paymentTermsState['fm_payment_terms_enforcement_action']) {
    resultId = paymentTermsState['fm_payment_terms_enforcement_action'] === 'defendantIsInCustody' ? 'PRIS' : 'NOENF';
  }

  if (addColloEnforcement) {
    enforcements.push(buildEnforcement('COLLO', null));
  }

  switch (resultId) {
    case 'PRIS':
      enforcements.push(
        buildEnforcement('PRIS', [
          buildEnforcementResultResponse(
            'earliestreleasedate',
            paymentTermsState['fm_payment_terms_earliest_release_date'] || null,
          ),
          buildEnforcementResultResponse(
            'prisonandprisonnumber',
            paymentTermsState['fm_payment_terms_prison_and_prison_number'] || null,
          ),
        ]),
      );
      break;
    case 'NOENF':
      enforcements.push(
        buildEnforcement('NOENF', [
          buildEnforcementResultResponse(
            'reason',
            paymentTermsState['fm_payment_terms_reason_account_is_on_noenf'] || null,
          ),
        ]),
      );
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
export const buildPaymentTermsPayload = (
  paymentTermsState: IFinesMacPaymentTermsState,
): IFinesMacPaymentTermsPayload => {
  const {
    fm_payment_terms_payment_terms,
    fm_payment_terms_pay_by_date,
    fm_payment_terms_start_date,
    fm_payment_instalment_period,
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
    effective_date: effectiveDate || null,
    instalment_period: getInstallmentPeriod(fm_payment_instalment_period),
    lump_sum_amount: fm_payment_terms_lump_sum_amount || null,
    instalment_amount: fm_payment_terms_instalment_amount || null,
    default_days_in_jail: fm_payment_terms_default_days_in_jail || null,
    enforcements: buildPaymentTermEnforcements(paymentTermsState),
  };
};
