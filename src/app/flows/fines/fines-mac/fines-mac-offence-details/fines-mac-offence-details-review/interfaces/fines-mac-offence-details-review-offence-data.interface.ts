import { IFinesMacOffenceDetailsReviewImpositionData } from './fines-mac-offence-details-review-imposition-data.interface';

export interface IFinesMacOffenceDetailsReviewOffenceData {
  id: number;
  dateOfSentence: string;
  offenceCode: string;
  offenceDescription: string;
  impositionData: IFinesMacOffenceDetailsReviewImpositionData[];
  amountImposedTotal: string;
  amountPaidTotal: string;
  balanceRemainingTotal: string;
}
