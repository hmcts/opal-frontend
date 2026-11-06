import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '../interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';

export const OPAL_FINES_ACCOUNT_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: null,
    history_items: [
      {
        type: 'Notes',
        posted_date: '2024-01-15T10:30:00Z',
        posted_by: 'Test User',
        details: {
          noteText: 'Minor creditor account note',
        },
      },
    ],
  };
