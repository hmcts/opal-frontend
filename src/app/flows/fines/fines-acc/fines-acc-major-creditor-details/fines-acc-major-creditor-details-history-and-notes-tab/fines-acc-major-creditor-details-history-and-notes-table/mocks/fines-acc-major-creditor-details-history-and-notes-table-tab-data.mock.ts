import { IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.interface';

export const FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_TAB_DATA_MOCK: IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: null,
    historyItems: [
      {
        amount: -25,
        details: {
          line1: [
            {
              fragments: [
                { text: 'Payment reversed', bold: false, hyphen: false },
                { text: 'Account 123', bold: false, hyphen: true },
              ],
            },
          ],
          line2: null,
        },
        postedDetails: {
          posted_by_name: 'Case worker',
          posted_date: '25/06/2026',
        },
        type: 'Financial',
      },
    ],
  };
