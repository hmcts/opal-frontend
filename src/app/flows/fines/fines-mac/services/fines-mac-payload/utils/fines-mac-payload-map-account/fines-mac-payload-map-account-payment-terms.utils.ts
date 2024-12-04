import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccount } from '../../interfaces/fines-mac-payload-account.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacPayloadAccountPaymentTermsEnforcement } from '../interfaces/fines-mac-payload-account-payment-terms-enforcement.interface';

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

const getPaymentTermsType = (
  paymentTermsTypeCode: string | null,
  lumpSumAmount: number | null,
  installmentAmount: number | null,
): string | null => {
  if (paymentTermsTypeCode === 'B') {
    return 'payInFull';
  } else if (lumpSumAmount) {
    return 'lumpSumPlusInstalments';
  } else if (installmentAmount) {
    return 'instalmentsOnly';
  }

  return null;
};

export const mapAccountPaymentTermsPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccount,
): IFinesMacState => {
  const payloadAccountPaymentTerms = payload.payment_terms;

  const {
    payment_card_request: paymentCardRequest,
    suspended_committal_date: suspendedCommittalDate,
    collection_order_made: collectionOrderMade,
    collection_order_made_today: collectionOrderMadeToday,
  } = payload;

  const paymentTermsType = getPaymentTermsType(
    payloadAccountPaymentTerms.payment_terms_type_code,
    payloadAccountPaymentTerms.lump_sum_amount,
    payloadAccountPaymentTerms.instalment_amount,
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
