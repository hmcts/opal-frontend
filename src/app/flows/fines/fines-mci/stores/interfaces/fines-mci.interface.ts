export type FinesMciJourney = 'criminal' | 'courtFee' | 'suspense';

export interface IFinesMciCourtFeeDraft {
  courtFeeId: number | null;
  amountPaid: string | null;
  numberOfItems: string | null;
}

export interface IFinesMciSuspensePayment {
  amount: string;
  payerType: 'defendant' | 'thirdParty' | null;
  methodOfPayment: 'notesCoins' | 'postalOrder' | 'cheque' | 'creditTransfer' | null;
  paymentReferencePostalOrder: string;
  paymentReferenceCheque: string;
  paymentReferenceCreditTransfer: string;
  source: string | null;
  reason: 'overpayment' | 'advance' | 'miscellaneous' | 'unidentified' | null;
  relevantDetails: string;
}

export interface IFinesMciCriminalPayment {
  amount: string;
  payerType: 'defendant' | 'thirdParty' | null;
  thirdPartyName: string;
  methodOfPayment: 'notesCoins' | 'postalOrder' | 'cheque' | 'creditTransfer' | null;
  paymentReferencePostalOrder: string;
  paymentReferenceCheque: string;
  paymentReferenceCreditTransfer: string;
  source: string | null;
}

export interface IFinesMciPayment {
  paymentId: string;
  journey: FinesMciJourney;
}

export interface IFinesMciTill {
  tillId: string;
  payments: IFinesMciPayment[];
}
