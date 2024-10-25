import { IFinesMacPaymentTermsEnforcementPayload } from './fines-mac-payment-terms-enforcement-payload.interface';

export interface IFinesMacPaymentTermsPayload {
  payment_terms_type_code: string | null;
  effective_date: string | null;
  instalment_period: string | null;
  lump_sum_amount: number | null;
  instalment_amount: number | null;
  default_days_in_jail: number | null;
  enforcements: IFinesMacPaymentTermsEnforcementPayload[] | null;
}
