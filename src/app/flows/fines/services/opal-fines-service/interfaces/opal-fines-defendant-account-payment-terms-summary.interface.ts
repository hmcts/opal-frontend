import { IOpalFinesDefendantAccountInstalmentPeriod } from './opal-fines-defendant-account-instalment-period.interface';
import { IOpalFinesDefendantAccountPaymentTermsType } from './opal-fines-defendant-account-payment-terms-type.interface';

export interface IOpalFinesDefendantAccountPaymentTermsSummary {
  payment_terms_type: IOpalFinesDefendantAccountPaymentTermsType;
  effective_date: string | null;
  instalment_period: IOpalFinesDefendantAccountInstalmentPeriod | null;
  lump_sum_amount: number | null;
  instalment_amount: number | null;
}
