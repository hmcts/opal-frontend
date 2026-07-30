import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_BRANCH_TAB_DATA_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: null,
    historyItems: [
      {
        amount: '£10.00',
        details: {
          line1: [
            {
              fragments: [
                { text: 'First', bold: false, hyphen: false },
                { text: 'Second', bold: false, hyphen: false },
              ],
            },
          ],
          line2: [{ fragments: [{ text: 'Line 2', bold: false, hyphen: false }] }],
        },
        postedDetails: {
          posted_by_name: 12345,
          posted_date: 1234567890,
        },
        type: 67890,
      },
      {
        amount: 15.5,
        details: {
          line1: [{ fragments: [{ text: 'Credit detail', bold: false, hyphen: false }] }],
          line2: null,
        },
      },
      {
        amount: 0,
        details: 'not transformed',
      },
      {
        amount: 'not a number',
      },
    ],
  };
