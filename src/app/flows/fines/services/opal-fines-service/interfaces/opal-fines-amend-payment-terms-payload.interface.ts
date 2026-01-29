import { IOpalFinesAmendPaymentTerms } from './opal-fines-amend-payment-terms.interface';
/**
 * Interface for amending payment terms on a defendant account
 */
export interface IOpalFinesAmendPaymentTermsPayload {
  payment_terms: IOpalFinesAmendPaymentTerms;
  request_payment_card: boolean | null; // Flag whether a payment card has been requested for this account
  generate_payment_terms_change_letter: boolean | null;
}
