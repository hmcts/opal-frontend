import { TFinesAccDefendantDetailsHistoryAndNotesFilterCategory } from '../../fines-acc-defendant-details/fines-acc-defendant-details-history-and-notes-tab/types/fines-acc-defendant-details-history-and-notes-filter-category.type';

export const FINES_ACC_HISTORY_FILTER_ITEM_TYPE_MAP: Partial<
  Record<TFinesAccDefendantDetailsHistoryAndNotesFilterCategory, string>
> = {
  amendments: 'amendments',
  enforcementActions: 'enforcements',
  financial: 'transactions',
  notes: 'notes',
  paymentTerms: 'paymentTerms',
};
