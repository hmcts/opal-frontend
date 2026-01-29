/**
 * Constant array of form fields to check for changes in payment terms amendment
 */
export const FINES_ACC_PAYMENT_TERMS_AMEND_FORM_FIELDS_TO_CHECK = [
  'facc_payment_terms_payment_terms',
  'facc_payment_terms_pay_by_date',
  'facc_payment_terms_lump_sum_amount',
  'facc_payment_terms_instalment_amount',
  'facc_payment_terms_instalment_period',
  'facc_payment_terms_start_date',
  'facc_payment_terms_payment_card_request',
  'facc_payment_terms_has_days_in_default',
  'facc_payment_terms_suspended_committal_date',
  'facc_payment_terms_default_days_in_jail',
  'facc_payment_terms_reason_for_change',
] as const;
