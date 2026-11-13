export interface IFinesMciCourtFeePaymentDetails {
  paymentReceivedFrom: string | null;
  paymentMethod: string | null;
  paymentSource?: string | null;
  paymentReference?: string | null;
  payerType: string | null;
  title?: string | null;
  firstNames?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  postcode: string | null;
}
