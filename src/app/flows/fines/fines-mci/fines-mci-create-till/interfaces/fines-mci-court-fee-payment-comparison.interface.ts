export interface ICourtFeePaymentComparison {
  type: 'information' | 'warning';
  heading: 'Confirm overpayment' | 'You cannot add an underpayment';
  message: string;
  courtFee: string;
  amount: string;
  numberOfItems: string;
}
