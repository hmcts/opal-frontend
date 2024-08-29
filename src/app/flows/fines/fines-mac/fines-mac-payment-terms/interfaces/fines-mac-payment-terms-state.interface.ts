export interface IFinesMacPaymentTermsState {
  paymentTerms: string | null;
  holdEnforcementOnAccount: boolean | null;
  hasDaysInDefault: boolean | null;
  daysInDefaultDate: string | null;
  daysInDefault: number | null;
}
