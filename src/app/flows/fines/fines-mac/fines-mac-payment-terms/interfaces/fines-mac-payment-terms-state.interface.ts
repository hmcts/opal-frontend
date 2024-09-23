export interface IFinesMacPaymentTermsState {
  has_collection_order?: boolean | null;
  collection_order_date?: string | null;
  make_collection_order_today?: boolean | null;
  payment_terms: string | null;
  pay_by_date?: string | null;
  lump_sum?: number | null;
  instalment?: number | null;
  frequency?: string | null;
  start_date?: string | null;
  request_payment_card?: boolean | null;
  has_days_in_default?: boolean | null;
  days_in_default_date?: string | null;
  days_in_default?: number | null;
  add_enforcement_action?: boolean | null;
  hold_enforcement_on_account?: boolean | null;
  reason_account_is_on_noenf?: string | null;
}
