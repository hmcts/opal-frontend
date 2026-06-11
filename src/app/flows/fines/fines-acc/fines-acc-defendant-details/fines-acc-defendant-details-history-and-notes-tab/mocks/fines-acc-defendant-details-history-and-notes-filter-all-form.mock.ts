import { IFinesAccDefendantDetailsHistoryAndNotesFilterForm } from '../interfaces/fines-acc-defendant-details-history-and-notes-filter-form.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_ALL_FORM_MOCK: IFinesAccDefendantDetailsHistoryAndNotesFilterForm =
  {
    formData: {
      dateFrom: '01/01/2024',
      dateTo: '31/01/2024',
      categories: {
        amendments: true,
        documents: true,
        enforcementActions: true,
        financial: true,
        notes: false,
        paymentTerms: true,
      },
    },
    nestedFlow: false,
  };
