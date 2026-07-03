import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_RENDER_TAB_DATA_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
  {
    version: 'mapped-version',
    historyItems: [
      {
        amount: '25',
        postedDetails: {
          posted_by_name: 'Finance officer',
          posted_date: '2026-06-25T08:30:00.000Z',
        },
        type: 'Financial',
        details: {
          line1: [{ fragments: [{ text: 'Payment received', bold: false, hyphen: false }] }],
          line2: null,
        },
      },
    ],
  };
