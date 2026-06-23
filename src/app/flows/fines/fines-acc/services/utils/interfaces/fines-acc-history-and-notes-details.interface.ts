import { IFinesAccHistoryAndNotesDetailsPart } from './fines-acc-history-and-notes-details-part.interface';

export interface IFinesAccHistoryAndNotesDetails {
  line1: IFinesAccHistoryAndNotesDetailsPart[];
  line2: IFinesAccHistoryAndNotesDetailsPart[] | null;
}
