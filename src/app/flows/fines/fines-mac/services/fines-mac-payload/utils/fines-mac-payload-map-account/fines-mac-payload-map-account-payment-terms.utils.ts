import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacPayloadAccountPaymentTermsEnforcement } from '../interfaces/fines-mac-payload-account-payment-terms-enforcement.interface';

/**
 * Maps enforcement actions to the fines MAC state.
 *
 * @param {IFinesMacState} mappedFinesMacState - The current state of the fines MAC.
 * @param {IFinesMacPayloadAccountPaymentTermsEnforcement[] | null} enforcements - The list of enforcement actions to be mapped.
 * @returns {IFinesMacState} - The updated fines MAC state with mapped enforcement actions.
 */
const mapEnforcementActions = (
  mappedFinesMacState: IFinesMacState,
  enforcements: IFinesMacPayloadAccountPaymentTermsEnforcement[] | null,
): IFinesMacState => {
  enforcements?.forEach((enforcement) => {
    const { enforcement_result_responses: enforcementResultResponses } = enforcement;

    enforcementResultResponses?.forEach((enforcementResultResponse) => {
      switch (enforcementResultResponse.parameter_name) {
        case 'earliestreleasedate':
          mappedFinesMacState.paymentTerms.formData.fm_payment_terms_earliest_release_date =
            enforcementResultResponse.response;
          break;
        case 'prisonandprisonnumber':
          mappedFinesMacState.paymentTerms.formData.fm_payment_terms_prison_and_prison_number =
            enforcementResultResponse.response;
          break;
        case 'reason':
          mappedFinesMacState.paymentTerms.formData.fm_payment_terms_reason_account_is_on_noenf =
            enforcementResultResponse.response;
          break;
      }
    });
  });

  return mappedFinesMacState;
};

/**
 * Determines the payment terms type based on the provided payment terms type code and lump sum amount.
 *
 * @param paymentTermsTypeCode - The code representing the type of payment terms.
 *                               If 'B', it indicates payment in full.
 * @param lumpSumAmount - The lump sum amount. If provided and not null, it indicates a combination of lump sum and instalments.
 *
 * @returns A string representing the payment terms type:
 *          - 'payInFull' if the payment terms type code is 'B'.
 *          - 'lumpSumPlusInstalments' if a lump sum amount is provided.
 *          - 'instalmentsOnly' if neither of the above conditions are met.
 */
const getPaymentTermsType = (paymentTermsTypeCode: string | null, lumpSumAmount: number | null): string => {
  if (paymentTermsTypeCode === 'B') {
    return 'payInFull';
  }

  if (lumpSumAmount) {
    return 'lumpSumPlusInstalments';
  }

  return 'instalmentsOnly';
};

/**
 * Maps the account defendant payload to the fines MAC state.
 *
 * @param {IFinesMacState} finesMacState - The current state of the fines MAC.
 * @param {IFinesMacAddAccountPayload} payload - The payload containing account information to be mapped.
 * @returns {IFinesMacState} - The updated fines MAC state with the mapped account information.
 *
 * The function performs the following operations:
 * - Creates a copy of the current fines MAC state.
 * - Extracts payment terms and other relevant account information from the payload.
 * - Determines the payment terms type and sets the appropriate dates based on the type.
 * - Updates the fines MAC state's payment terms form data with the extracted and computed values.
 * - Calls `mapEnforcementActions` to map enforcement actions and returns the updated state.
 */
export const mapAccountDefendantPayload = (
  finesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const mappedFinesMacState = { ...finesMacState };
  const payloadAccountPaymentTerms = payload.account.payment_terms;

  const {
    payment_card_request: paymentCardRequest,
    suspended_committal_date: suspendedCommittalDate,
    collection_order_made: collectionOrderMade,
    collection_order_made_today: collectionOrderMadeToday,
  } = payload.account;

  const paymentTermsType = getPaymentTermsType(
    payloadAccountPaymentTerms.payment_terms_type_code,
    payloadAccountPaymentTerms.lump_sum_amount,
  );
  const payByDate = paymentTermsType === 'payInFull' ? payloadAccountPaymentTerms.effective_date : null;
  const startDate = paymentTermsType !== 'payInFull' ? payloadAccountPaymentTerms.effective_date : null;

  mappedFinesMacState.paymentTerms.formData = {
    ...mappedFinesMacState.paymentTerms.formData,
    fm_payment_terms_payment_terms: paymentTermsType,
    fm_payment_terms_pay_by_date: payByDate,
    fm_payment_terms_start_date: startDate,
    fm_payment_instalment_period: payloadAccountPaymentTerms.instalment_period ?? null,
    fm_payment_terms_lump_sum_amount: payloadAccountPaymentTerms.lump_sum_amount ?? null,
    fm_payment_terms_instalment_amount: payloadAccountPaymentTerms.instalment_amount ?? null,
    fm_payment_terms_has_days_in_default: !!payloadAccountPaymentTerms.default_days_in_jail,
    fm_payment_terms_default_days_in_jail: payloadAccountPaymentTerms.default_days_in_jail ?? null,
    fm_payment_terms_payment_card_request: paymentCardRequest,
    fm_payment_terms_suspended_committal_date: suspendedCommittalDate ?? null,
    fm_payment_terms_collection_order_made: collectionOrderMade,
    fm_payment_terms_collection_order_made_today: collectionOrderMadeToday,
  };

  return mapEnforcementActions(mappedFinesMacState, payloadAccountPaymentTerms.enforcements);
};
