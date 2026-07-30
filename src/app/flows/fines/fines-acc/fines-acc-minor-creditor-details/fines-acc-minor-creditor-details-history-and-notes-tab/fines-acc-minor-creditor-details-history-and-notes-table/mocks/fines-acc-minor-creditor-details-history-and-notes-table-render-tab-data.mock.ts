import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';

export const FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_RENDER_TAB_DATA_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: null,
    historyItems: [
      {
        amount: 50,
        details: {
          line1: [{ fragments: [{ text: 'Payment received', bold: false, hyphen: false }] }],
          line2: null,
        },
        postedDetails: {
          posted_by_name: 'Finance officer',
          posted_date: '25/06/2026',
        },
        type: 'Financial',
      },
    ],
  };
