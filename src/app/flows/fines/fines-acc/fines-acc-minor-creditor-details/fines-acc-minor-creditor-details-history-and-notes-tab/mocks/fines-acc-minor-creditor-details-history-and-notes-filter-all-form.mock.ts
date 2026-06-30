import { IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm } from '../interfaces/fines-acc-minor-creditor-details-history-and-notes-filter-form.interface';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_ALL_FORM_MOCK: IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm =
  {
    formData: {
      dateFrom: '01/01/2024',
      dateTo: '31/01/2024',
      categories: {
        amendments: true,
        notes: true,
        financial: true,
      },
    },
    nestedFlow: false,
  };
