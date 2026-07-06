import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_MAP_TAB_DATA_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
  {
    version: 'mapped-version',
    historyItems: [
      {
        amount: '-£25.00',
        postedDetails: {
          posted_by_name: 'Case worker',
          posted_date: '25/06/2026',
        },
        type: 'Payment',
        details: {
          line1: [
            {
              fragments: [
                { text: 'Payment reversed', bold: false, hyphen: false },
                { text: 'Account 123', bold: true, hyphen: true },
              ],
            },
          ],
          line2: null,
        },
      },
    ],
  };
