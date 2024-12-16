import { IFinesMacPayloadBuildAccountPaymentTermsEnforcement } from './fines-mac-payload-build-account-payment-terms-enforcement.interface';

export interface IFinesMacPayloadBuildAccountPaymentTerms {
  payment_terms_type_code: string | null;
  effective_date: string | null;
  instalment_period: string | null;
  lump_sum_amount: number | null;
  instalment_amount: number | null;
  default_days_in_jail: number | null;
  enforcements: IFinesMacPayloadBuildAccountPaymentTermsEnforcement[] | null;
}
