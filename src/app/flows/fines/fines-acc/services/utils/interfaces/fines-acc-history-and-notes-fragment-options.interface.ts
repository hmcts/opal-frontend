import { IFinesAccHistoryAndNotesDetailsLink } from './fines-acc-history-and-notes-details-link.interface';

export interface IFinesAccHistoryAndNotesFragmentOptions {
  bold?: boolean;
  hyphen?: boolean;
  link?: IFinesAccHistoryAndNotesDetailsLink | null;
}
