import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccount } from '../../interfaces/fines-mac-payload-account.interface';
import { IFinesMacPayloadAccountPaymentTermsEnforcement } from '../interfaces/fines-mac-payload-account-payment-terms-enforcement.interface';

/**
 * Maps enforcement actions to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param enforcements - An array of enforcement actions or null.
 * @returns The updated fines MAC state with mapped enforcement actions.
 */
const mapEnforcementActions = (
  mappedFinesMacState: IFinesMacState,
  enforcements: IFinesMacPayloadAccountPaymentTermsEnforcement[] | null,
): IFinesMacState => {
  enforcements?.forEach(({ enforcement_result_responses: responses }) => {
    responses?.forEach(({ parameter_name, response }) => {
      const formData = mappedFinesMacState.paymentTerms.formData;

      if (parameter_name === 'earliestreleasedate') {
        formData.fm_payment_terms_earliest_release_date = response;
      } else if (parameter_name === 'prisonandprisonnumber') {
        formData.fm_payment_terms_prison_and_prison_number = response;
      } else if (parameter_name === 'reason') {
        formData.fm_payment_terms_reason_account_is_on_noenf = response;
      }
    });
  });

  return mappedFinesMacState;
};

/**
 * Determines the payment terms type based on the provided payment terms type code,
 * lump sum amount, and instalment amount.
 *
 * @param paymentTermsTypeCode - The code representing the type of payment terms.
 * @param lumpSumAmount - The amount for a lump sum payment.
 * @param instalmentAmount - The amount for instalment payments.
 * @returns A string representing the payment terms type, or null if no valid type is determined.
 */
const getPaymentTermsType = (
  paymentTermsTypeCode: string | null,
  lumpSumAmount: number | null,
  instalmentAmount: number | null,
): string | null => {
  if (paymentTermsTypeCode === 'B') {
    return 'payInFull';
  }
  if (lumpSumAmount) {
    return 'lumpSumPlusInstalments';
  }

  if (instalmentAmount) {
    return 'instalmentsOnly';
  }

  return null;
};

/**
 * Maps the account payment terms payload to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing the account payment terms data.
 * @returns The updated fines MAC state with the mapped payment terms data.
 *
 */
export const mapAccountPaymentTermsPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccount,
): IFinesMacState => {
  const {
    payment_terms: paymentTerms,
    payment_card_request: paymentCardRequest,
    suspended_committal_date: suspendedCommittalDate,
    collection_order_made: collectionOrderMade,
    collection_order_made_today: collectionOrderMadeToday,
  } = payload;

  const paymentTermsType = getPaymentTermsType(
    paymentTerms.payment_terms_type_code,
    paymentTerms.lump_sum_amount,
    paymentTerms.instalment_amount,
  );

  const isPayInFull = paymentTermsType === 'payInFull';
  const payByDate = isPayInFull ? paymentTerms.effective_date : null;
  const startDate = !isPayInFull ? paymentTerms.effective_date : null;

  mappedFinesMacState.paymentTerms.formData = {
    ...mappedFinesMacState.paymentTerms.formData,
    fm_payment_terms_payment_terms: paymentTermsType,
    fm_payment_terms_pay_by_date: payByDate,
    fm_payment_terms_start_date: startDate,
    fm_payment_instalment_period: paymentTerms.instalment_period ?? null,
    fm_payment_terms_lump_sum_amount: paymentTerms.lump_sum_amount ?? null,
    fm_payment_terms_instalment_amount: paymentTerms.instalment_amount ?? null,
    fm_payment_terms_has_days_in_default: !!paymentTerms.default_days_in_jail,
    fm_payment_terms_default_days_in_jail: paymentTerms.default_days_in_jail ?? null,
    fm_payment_terms_payment_card_request: paymentCardRequest,
    fm_payment_terms_suspended_committal_date: suspendedCommittalDate ?? null,
    fm_payment_terms_collection_order_made: collectionOrderMade,
    fm_payment_terms_collection_order_made_today: collectionOrderMadeToday,
  };

  return mapEnforcementActions(mappedFinesMacState, paymentTerms.enforcements);
};
