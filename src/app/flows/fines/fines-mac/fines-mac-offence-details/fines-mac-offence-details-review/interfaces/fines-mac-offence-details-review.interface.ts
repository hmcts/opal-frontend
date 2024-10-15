import { IFinesMacOffenceDetailsReviewOffenceData } from './fines-mac-offence-details-review-offence-data.interface';

export interface IFinesMacOffenceDetailsReview {
  offenceData: IFinesMacOffenceDetailsReviewOffenceData[];
  totalAmountImposed: string;
  totalAmountPaid: string;
  totalBalanceRemaining: string;
}
