import { TFinesAccDefendantDetailsHistoryAndNotesFilterCategory } from '../../fines-acc-defendant-details/fines-acc-defendant-details-history-and-notes-tab/types/fines-acc-defendant-details-history-and-notes-filter-category.type';

export const FINES_ACC_HISTORY_FILTER_ITEM_TYPE_MAP: Record<
  TFinesAccDefendantDetailsHistoryAndNotesFilterCategory,
  string
> = {
  amendments: 'amendments',
  documents: 'documents',
  enforcementActions: 'enforcements',
  financial: 'transactions',
  notes: 'notes',
  paymentTerms: 'paymentTerms',
};
