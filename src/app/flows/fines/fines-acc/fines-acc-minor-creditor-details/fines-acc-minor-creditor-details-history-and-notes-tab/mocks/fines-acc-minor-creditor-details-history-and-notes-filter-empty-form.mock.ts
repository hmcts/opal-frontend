import { IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm } from '../interfaces/fines-acc-minor-creditor-details-history-and-notes-filter-form.interface';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_EMPTY_FORM_MOCK: IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm =
  {
    formData: {
      dateFrom: null,
      dateTo: null,
      categories: {
        amendments: false,
        notes: false,
        financial: false,
      },
    },
    nestedFlow: false,
  };
