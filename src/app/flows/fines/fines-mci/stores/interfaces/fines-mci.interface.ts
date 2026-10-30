export type FinesMciJourney = 'criminal' | 'courtFee' | 'suspense';

export interface IFinesMciPayment {
  paymentId: string;
  journey: FinesMciJourney;
}

export interface IFinesMciTill {
  tillId: string;
  payments: IFinesMciPayment[];
}
