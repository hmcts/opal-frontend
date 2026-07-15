import { TFinesAccMinorCreditorDetailsHistoryAndNotesFilterCategory } from '../types/fines-acc-minor-creditor-details-history-and-notes-filter-category.type';

export interface IFinesAccMinorCreditorDetailsHistoryAndNotesFilterFormState {
  dateFrom: string | null;
  dateTo: string | null;
  categories: Record<TFinesAccMinorCreditorDetailsHistoryAndNotesFilterCategory, boolean>;
}
