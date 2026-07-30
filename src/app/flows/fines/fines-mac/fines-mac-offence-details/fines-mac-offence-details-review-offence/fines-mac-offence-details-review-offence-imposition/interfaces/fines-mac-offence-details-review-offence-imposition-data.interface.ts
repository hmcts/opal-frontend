import { IFinesMacOffenceDetailsReviewSummaryMinorCreditorTableData } from './fines-mac-offence-details-review-summary-minor-creditor-table-data.interface';

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
