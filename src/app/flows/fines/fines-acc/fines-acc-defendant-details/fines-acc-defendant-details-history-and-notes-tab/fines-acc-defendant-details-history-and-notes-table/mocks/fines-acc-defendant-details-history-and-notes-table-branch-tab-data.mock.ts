import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_BRANCH_TAB_DATA_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
  {
    version: 'branch-version',
    historyItems: [
      {
        amount: 10,
        postedDetails: {
          posted_by_name: 12345,
          posted_date: 1234567890,
        },
        type: 67890,
        details: {
          line1: [
            {
              fragments: [
                { text: 'First', bold: false, hyphen: false },
                { text: 'Second', bold: false, hyphen: false },
              ],
            },
          ],
          line2: [
            {
              fragments: [{ text: 'Line 2', bold: false, hyphen: false }],
            },
          ],
        },
      },
      {
        amount: '£15.50',
        posted_date: 'not a date',
        user_name: '',
        details: {
          line1: [{ fragments: [{ text: 'Credit detail', bold: false, hyphen: false }] }],
        },
      },
      {
        amount: 0,
        posted_date: '',
        details: {
          line1: 'not a details part array',
        },
      },
      {
        amount: 'not a number',
        details: null,
      },
    ],
  };
