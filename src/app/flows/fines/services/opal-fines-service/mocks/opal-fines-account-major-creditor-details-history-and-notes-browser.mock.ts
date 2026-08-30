import { IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData } from '../interfaces/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.interface';

export const USE_MAJOR_CREDITOR_HISTORY_BROWSER_MOCK =
  typeof window === 'undefined' || window.location.port === '4200';

export const OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_BROWSER_MOCK: IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: 'browser-history-mock',
    historyItems: [
      {
        amount: 125,
        details: {
          line1: [{ fragments: [{ text: 'BACS payment received', bold: true, hyphen: false }] }],
          line2: [{ fragments: [{ text: 'Payment reference: MAJOR-001', bold: false, hyphen: false }] }],
        },
        postedDetails: {
          posted_by_name: 'Finance officer',
          posted_date: '26/06/2026',
        },
        type: 'Financial',
      },
      {
        amount: -25,
        details: {
          line1: [{ fragments: [{ text: 'Payment reversed', bold: false, hyphen: false }] }],
          line2: null,
        },
        postedDetails: {
          posted_by_name: 'Case worker',
          posted_date: '25/06/2026',
        },
        type: 'Financial',
      },
      {
        details: {
          line1: [{ fragments: [{ text: 'Account note added', bold: false, hyphen: false }] }],
          line2: [{ fragments: [{ text: 'Customer asked for a statement.', bold: false, hyphen: false }] }],
        },
        postedDetails: {
          posted_by_name: 'Account manager',
          posted_date: '24/06/2026',
        },
        type: 'Notes',
      },
    ],
  };
