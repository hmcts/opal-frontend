import { IFinesMciCourtFeePaymentDetails } from './fines-mci-court-fee-payment-details.interface';

export interface IFinesMciCourtFeePayment {
  courtFeeId: number;
  amountPaid: string;
  numberOfItems: string;
  courtFeeLabel: string;
  amountLabel: string;
  paymentDetails: IFinesMciCourtFeePaymentDetails & {
    paymentReceivedFrom: string;
    paymentMethod: string;
    payerType: string;
  };
  suspenseNote: string;
}
