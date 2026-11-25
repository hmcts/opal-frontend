export interface IFinesMciCourtFeePaymentDetails {
  paymentReceivedFrom: string;
  paymentMethod: string;
  paymentSource?: string | null;
  paymentReference?: string | null;
  payerType: string;
  title?: string | null;
  firstNames?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  postcode?: string | null;
}
