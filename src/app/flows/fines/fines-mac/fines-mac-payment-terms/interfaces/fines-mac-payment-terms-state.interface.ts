export interface IFinesMacPaymentTermsState {
  fm_payment_terms_has_collection_order?: boolean | null;
  fm_payment_terms_collection_order_date?: string | null;
  fm_payment_terms_make_collection_order_today?: boolean | null;
  fm_payment_terms_payment_terms: string | null;
  fm_payment_terms_pay_by_date?: string | null;
  fm_payment_terms_lump_sum?: number | null;
  fm_payment_terms_instalment?: number | null;
  fm_payment_terms_frequency?: string | null;
  fm_payment_terms_start_date?: string | null;
  fm_payment_terms_request_payment_card?: boolean | null;
  fm_payment_terms_has_days_in_default?: boolean | null;
  fm_payment_terms_days_in_default_date?: string | null;
  fm_payment_terms_days_in_default?: number | null;
  fm_payment_terms_add_enforcement_action?: boolean | null;
  fm_payment_terms_hold_enforcement_on_account?: boolean | null;
  fm_payment_terms_reason_account_is_on_noenf?: string | null;
}
