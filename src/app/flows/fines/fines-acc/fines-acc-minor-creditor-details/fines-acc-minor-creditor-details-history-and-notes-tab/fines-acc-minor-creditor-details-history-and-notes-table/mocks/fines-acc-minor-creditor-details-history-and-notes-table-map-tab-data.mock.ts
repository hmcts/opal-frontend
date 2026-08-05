import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_MAP_TAB_DATA_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: null,
    historyItems: [
      {
        amount: '-25.00',
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
        type: 'Payment',
      },
    ],
  };
