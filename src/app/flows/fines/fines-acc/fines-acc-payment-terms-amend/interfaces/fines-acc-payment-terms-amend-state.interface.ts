export interface IFinesAccPaymentTermsAmendState {
  facc_payment_terms_payment_terms: string | null;
  facc_payment_terms_pay_by_date: string | null;
  facc_payment_terms_lump_sum_amount: number | null;
  facc_payment_terms_instalment_amount: number | null;
  facc_payment_terms_instalment_period: string | null;
  facc_payment_terms_start_date: string | null;
  facc_payment_terms_payment_card_request: boolean | null;
  facc_payment_terms_has_days_in_default: boolean | null;
  facc_payment_terms_suspended_committal_date: string | null;
  facc_payment_terms_default_days_in_jail: number | null;
  facc_payment_terms_reason_for_change: string | null;
  facc_payment_terms_change_letter: boolean | null;
}
