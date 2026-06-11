import { IFinesAccDefendantDetailsHistoryAndNotesFilterForm } from '../interfaces/fines-acc-defendant-details-history-and-notes-filter-form.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK: IFinesAccDefendantDetailsHistoryAndNotesFilterForm =
  {
    formData: {
      dateFrom: null,
      dateTo: null,
      categories: {
        amendments: false,
        documents: false,
        enforcementActions: false,
        financial: false,
        notes: false,
        paymentTerms: false,
      },
    },
    nestedFlow: false,
  };
