import { IFinesMacPaymentTermsState } from '../../../../../fines-mac-payment-terms/interfaces/fines-mac-payment-terms-state.interface';

export const FINES_MAC_PAYLOAD_PAYMENT_TERMS_IN_FULL_MOCK: IFinesMacPaymentTermsState = {
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
  fm_payment_terms_lump_sum_amount: null,
  fm_payment_terms_instalment_amount: null,
  fm_payment_terms_instalment_period: null,
  fm_payment_terms_start_date: null,
  fm_payment_terms_hold_enforcement_on_account: false,
  fm_payment_terms_reason_account_is_on_noenf: null,
  fm_payment_terms_collection_order_made_today: null,
};
