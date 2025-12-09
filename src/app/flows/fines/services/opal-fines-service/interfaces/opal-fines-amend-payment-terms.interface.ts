/**
 * Interface for payment terms type object
 */
export interface IOpalFinesPaymentTermsType {
  payment_terms_type_code: string;
}

/**
 * Interface for instalment period object
 */
export interface IOpalFinesInstalmentPeriod {
  instalment_period_code: string;
}

/**
 * Interface for payment terms object within the amend payload
 */
export interface IOpalFinesAmendPaymentTerms {
  jail_days: number | null; // Days in default
  suspended_committal_date: string | null; // Date days in default imposed
  reason_for_extension: string | null;
  extension: boolean | null; // Used to determine whether conditional 'Payment terms amendments' panel is displayed
  payment_terms_type: IOpalFinesPaymentTermsType | null; // Payment Terms type object
  effective_date: string | null; // Also known as 'Start Date' when the payment terms are instalments
  instalment_period: IOpalFinesInstalmentPeriod | null; // Instalment period object
  lump_sum_amount: number | null; // MultipleOf: 0.01
  instalment_amount: number | null;
}

/**
 * Interface for amending payment terms on a defendant account
 */
export interface IOpalFinesAmendPaymentTermsPayload {
  payment_terms: IOpalFinesAmendPaymentTerms;
  payment_card_requested: boolean | null; // Flag whether a payment card has been requested for this account
  generate_payment_terms_change_letter: boolean | null;
}

/**
 * Interface for the response when amending payment terms
 */
export interface IOpalFinesAmendPaymentTermsResponse {
  defendant_account_id: number;
  message?: string;
}
