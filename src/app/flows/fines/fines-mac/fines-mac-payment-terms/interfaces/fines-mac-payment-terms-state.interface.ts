export interface IFinesMacPaymentTermsState {
  payment_terms: string | null;
  hold_enforcement_on_account: boolean | null;
  has_days_in_default: boolean | null;
  days_in_default_date: string | null;
  days_in_default: number | null;
}
