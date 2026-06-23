import { IFinesAccHistoryAndNotesDetailsLink } from './fines-acc-history-and-notes-details-link.interface';

export interface IFinesAccHistoryAndNotesDetailsFragment {
  text: string;
  bold: boolean;
  hyphen: boolean;
  link?: IFinesAccHistoryAndNotesDetailsLink | null;
}
