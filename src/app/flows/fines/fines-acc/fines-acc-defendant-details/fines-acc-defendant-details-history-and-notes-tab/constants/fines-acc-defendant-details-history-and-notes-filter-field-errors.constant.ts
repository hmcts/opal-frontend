import { IFinesAccDefendantDetailsHistoryAndNotesFilterFieldErrors } from '../interfaces/fines-acc-defendant-details-history-and-notes-filter-field-errors.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS: IFinesAccDefendantDetailsHistoryAndNotesFilterFieldErrors =
  {
    dateFrom: {
      invalidDateFormat: {
        message: 'Date from must be in the format DD/MM/YYYY',
        priority: 1,
      },
      invalidDate: {
        message: 'Enter a valid date from',
        priority: 2,
      },
    },
    dateTo: {
      invalidDateFormat: {
        message: 'Date to must be in the format DD/MM/YYYY',
        priority: 1,
      },
      invalidDate: {
        message: 'Enter a valid date to',
        priority: 2,
      },
      dateNotBefore: {
        message: 'Date from must be the same as or earlier than Date to',
        priority: 3,
      },
    },
  };
