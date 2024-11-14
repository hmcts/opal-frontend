import { IFinesMacPaymentTermsState } from '../../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';

export const FINES_MAC_PAYLOAD_ACCOUNT_PAYMENT_TERMS_IN_FULL_MOCK: IFinesMacPaymentTermsState = {
  fm_payment_terms_payment_terms: 'payInFull',
  fm_payment_terms_payment_card_request: true,
  fm_payment_terms_collection_order_made: true,
  fm_payment_terms_has_days_in_default: true,
  fm_payment_terms_add_enforcement_action: true,
  fm_payment_terms_collection_order_date: '22/10/2024',
  fm_payment_terms_pay_by_date: '15/10/2024',
  fm_payment_terms_suspended_committal_date: '12/10/2024',
  fm_payment_terms_default_days_in_jail: 12,
  fm_payment_terms_enforcement_action: 'PRIS',
  fm_payment_terms_earliest_release_date: '12/10/2024',
  fm_payment_terms_prison_and_prison_number: 'test test',
};

export const FINES_MAC_PAYLOAD_ACCOUNT_PAYMENT_TERMS_INSTALMENTS_MOCK: IFinesMacPaymentTermsState = {
  fm_payment_terms_payment_terms: 'instalmentsOnly',
  fm_payment_terms_payment_card_request: true,
  fm_payment_terms_add_enforcement_action: true,
  fm_payment_terms_instalment_amount: 100,
  fm_payment_instalment_period: 'W',
  fm_payment_terms_start_date: '11/10/2019',
  fm_payment_terms_enforcement_action: 'NOENF',
  fm_payment_terms_reason_account_is_on_noenf: 'Test',
};

export const FINES_MAC_PAYLOAD_ACCOUNT_PAYMENT_TERMS_LUMP_SUM_PLUS_INSTALMENTS_MOCK: IFinesMacPaymentTermsState = {
  fm_payment_terms_payment_terms: 'lumpSumPlusInstalments',
  fm_payment_terms_payment_card_request: true,
  fm_payment_terms_collection_order_made: true,
  fm_payment_terms_has_days_in_default: true,
  fm_payment_terms_add_enforcement_action: true,
  fm_payment_terms_lump_sum_amount: 1000,
  fm_payment_terms_instalment_amount: 100,
  fm_payment_instalment_period: 'W',
  fm_payment_terms_start_date: '18/10/2024',
  fm_payment_terms_collection_order_date: '21/10/2024',
  fm_payment_terms_suspended_committal_date: '11/10/2024',
  fm_payment_terms_default_days_in_jail: 11,
  fm_payment_terms_enforcement_action: 'PRIS',
  fm_payment_terms_earliest_release_date: '24/10/2024',
  fm_payment_terms_prison_and_prison_number: 'Test and test',
};

export const FINES_MAC_PAYLOAD_ACCOUNT_PAYMENT_TERMS_NULL_MOCK: IFinesMacPaymentTermsState = {
  fm_payment_terms_payment_terms: null,
  fm_payment_terms_payment_card_request: true,
  fm_payment_terms_collection_order_made: true,
  fm_payment_terms_has_days_in_default: true,
  fm_payment_terms_add_enforcement_action: true,
  fm_payment_terms_lump_sum_amount: null,
  fm_payment_terms_instalment_amount: null,
  fm_payment_instalment_period: null,
  fm_payment_terms_start_date: null,
  fm_payment_terms_collection_order_date: null,
  fm_payment_terms_suspended_committal_date: null,
  fm_payment_terms_default_days_in_jail: null,
  fm_payment_terms_enforcement_action: null,
  fm_payment_terms_earliest_release_date: null,
  fm_payment_terms_prison_and_prison_number: null,
};
