export interface IFinesMacOffenceDetailsReviewSummaryMinorCreditorTableData {
  address: string | null;
  paymentMethod: string | null;
  nameOnAccount: string | null;
  sortCode: string | null;
  accountNumber: string | null;
  paymentReference: string | null;
}

export interface IFinesMacOffenceDetailsReviewSummaryImpositionTableRowTotalData {
  totalAmountImposed: string;
  totalAmountPaid: string;
  totalBalanceRemaining: string;
}

export interface IFinesMacOffenceDetailsReviewSummaryImpositionTableData {
  impositionId: number;
  impositionDescription: string;
  creditor: string;
  minorCreditor: IFinesMacOffenceDetailsReviewSummaryMinorCreditorTableData | null;
  showMinorCreditorData: boolean;
  amountImposed: string;
  amountPaid: string;
  balanceRemaining: string;
}
