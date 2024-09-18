export interface IFinesMacPaymentTermsState {
  payment_terms: string | null;
  pay_by_date?: string | null;
  lump_sum?: number | null;
  instalment?: number | null;
  frequency?: string | null;
  start_date?: string | null;
  request_payment_card: boolean | null;
  has_days_in_default: boolean | null;
  days_in_default_date: string | null;
  days_in_default: number | null;
  add_enforcement_action: boolean | null;
}
