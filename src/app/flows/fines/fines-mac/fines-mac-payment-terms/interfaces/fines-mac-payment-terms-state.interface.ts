export interface IFinesMacPaymentTermsState {
  paymentTerms: string | null;
  payByDate: string | null;
  lumpSum: number | null;
  instalment: number | null;
  frequency: string | null;
  startDate: string | null;
  requestPaymentCard: boolean | null;
  hasDaysInDefault: boolean | null;
  daysInDefaultDate: string | null;
  daysInDefault: number | null;
  addEnforcementAction: boolean | null;
}
