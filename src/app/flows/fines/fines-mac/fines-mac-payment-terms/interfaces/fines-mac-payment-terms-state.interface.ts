export interface IFinesMacPaymentTermsState {
  fm_payment_terms_collection_order_made?: boolean | null;
  fm_payment_terms_collection_order_date?: string | null;
  fm_payment_terms_collection_order_made_today?: boolean | null;
  fm_payment_terms_payment_terms: string | null;
  fm_payment_terms_pay_by_date?: string | null;
  fm_payment_terms_lump_sum_amount?: number | null;
  fm_payment_terms_instalment_amount?: number | null;
  fm_payment_terms_instalment_period?: string | null;
  fm_payment_terms_start_date?: string | null;
  fm_payment_terms_payment_card_request?: boolean | null;
  fm_payment_terms_has_days_in_default?: boolean | null;
  fm_payment_terms_suspended_committal_date?: string | null;
  fm_payment_terms_default_days_in_jail?: number | null;
  fm_payment_terms_add_enforcement_action?: boolean | null;
  fm_payment_terms_enforcement_action?: string | null;
  fm_payment_terms_earliest_release_date?: string | null;
  fm_payment_terms_prison_and_prison_number?: string | null;
  fm_payment_terms_hold_enforcement_on_account?: boolean | null;
  fm_payment_terms_reason_account_is_on_noenf?: string | null;
}
