import { IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData } from '../interfaces/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.interface';

export const OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK: IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: null,
    historyItems: [
      {
        type: 'Financial',
        details: {
          transactionType: {
            transactionType: 'BACS',
          },
          paymentReference: 'MJH0000004',
        },
      },
    ],
  };
