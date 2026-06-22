import { TFinesAccDefendantDetailsHistoryAndNotesFilterCategory } from '../types/fines-acc-defendant-details-history-and-notes-filter-category.type';

export interface IFinesAccDefendantDetailsHistoryAndNotesFilterFormState {
  dateFrom: string | null;
  dateTo: string | null;
  categories: Record<TFinesAccDefendantDetailsHistoryAndNotesFilterCategory, boolean>;
}
