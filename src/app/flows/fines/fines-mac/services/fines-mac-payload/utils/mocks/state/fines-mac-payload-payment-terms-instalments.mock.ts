import { IFinesMacPaymentTermsState } from '../../../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';

export const FINES_MAC_PAYLOAD_PAYMENT_TERMS_INSTALMENTS_MOCK: IFinesMacPaymentTermsState = {
  fm_payment_terms_payment_terms: 'instalmentsOnly',
  fm_payment_terms_payment_card_request: true,
  fm_payment_terms_add_enforcement_action: true,
  fm_payment_terms_instalment_amount: 100,
  fm_payment_terms_instalment_period: 'W',
  fm_payment_terms_start_date: '11/10/2019',
  fm_payment_terms_enforcement_action: 'NOENF',
  fm_payment_terms_reason_account_is_on_noenf: 'Test',
  fm_payment_terms_collection_order_made: true,
  fm_payment_terms_collection_order_date: '11/10/2019',
  fm_payment_terms_pay_by_date: null,
  fm_payment_terms_suspended_committal_date: null,
  fm_payment_terms_default_days_in_jail: null,
  fm_payment_terms_earliest_release_date: null,
  fm_payment_terms_prison_and_prison_number: null,
  fm_payment_terms_lump_sum_amount: null,
  fm_payment_terms_hold_enforcement_on_account: null,
  fm_payment_terms_collection_order_made_today: null,
  fm_payment_terms_has_days_in_default: null,
};
