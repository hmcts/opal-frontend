import { IOpalFinesAmendPaymentTermsInstalmentPeriod } from './opal-fines-amend-payment-terms-installment-period.interface';
import { IOpalFinesAmendPaymentTermsType } from './opal-fines-amend-payment-terms-payment-terms-type.interface';

/**
 * Interface for payment terms object within the amend payload
 */
export interface IOpalFinesAmendPaymentTerms {
  days_in_default: number | null; // Days in default
  date_days_in_default_imposed: string | null; // Date days in default imposed
  reason_for_extension: string | null;
  extension: boolean | null; // Used to determine whether conditional 'Payment terms amendments' panel is displayed
  payment_terms_type: IOpalFinesAmendPaymentTermsType | null; // Payment Terms type object
  effective_date: string | null; // Also known as 'Start Date' when the payment terms are instalments
  instalment_period: IOpalFinesAmendPaymentTermsInstalmentPeriod | null; // Instalment period object
  lump_sum_amount: number | null; // MultipleOf: 0.01
  instalment_amount: number | null;
}
