import { IFinesMciCourtFeePayment } from './fines-mci-court-fee-payment.interface';

export type FinesMciJourney = 'criminal' | 'courtFee' | 'suspense';

export interface IFinesMciCourtFeeDraft {
  courtFeeId: number | null;
  amountPaid: string | null;
  numberOfItems: string | null;
}

export interface IFinesMciPayment {
  paymentId: string;
  journey: FinesMciJourney;
  courtFee?: IFinesMciCourtFeePayment;
}

export interface IFinesMciTill {
  tillId: string;
  payments: IFinesMciPayment[];
}
