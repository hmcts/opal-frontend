import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';

const BULK_HISTORY_BASE_TIMESTAMP = Date.UTC(2025, 0, 1, 12, 0, 0, 0);

export const ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_INITIAL_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: '1',
    history_items: [
      {
        type: 'Financial',
        amount: '50',
        postedDetails: {
          posted_by_name: 'Finance officer',
          posted_date: '2025-03-12T08:30:00.124Z',
        },
        details: {
          transactionType: {
            transactionType: 'PAYMNT',
          },
          defendantAccountNumber: '2500000BV',
          defendantAccountId: '123123',
        },
      },
      {
        type: 'Notes',
        postedDetails: {
          posted_by_name: 'Notes user',
          posted_date: '2025-03-11T09:15:00.000Z',
        },
        details: {
          noteText: 'Minor creditor account note',
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_FILTERED_NOTES_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: '2',
    history_items: [
      {
        type: 'Notes',
        postedDetails: {
          posted_by_name: 'Filtered notes user',
          posted_date: '2025-03-11T09:15:00.000Z',
        },
        details: {
          noteText: 'Filtered minor creditor note.',
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_EMPTY_RESULTS_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: '3',
    history_items: [],
  };

export const ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_DATE_SORTING_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: '4',
    history_items: [
      {
        type: 'Notes',
        posted_date: '2025-03-11T23:59:59.999Z',
        posted_by: 'Oldest day user',
        details: {
          note_text: 'Oldest day note',
        },
      },
      {
        type: 'Notes',
        posted_date: '2025-03-12T12:00:00.100Z',
        posted_by: 'Older milliseconds user',
        details: {
          note_text: 'Older same-day note',
        },
      },
      {
        type: 'Notes',
        posted_date: '2025-03-12T12:00:00.900Z',
        posted_by: 'Newest milliseconds user',
        details: {
          note_text: 'Newest same-day note',
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_AMOUNT_ACCESSIBILITY_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: '5',
    history_items: [
      {
        type: 'Financial',
        amount: '50',
        postedDetails: {
          posted_by_name: 'Credit user',
          posted_date: '2025-03-12T08:30:00.124Z',
        },
        details: {
          transaction_type: 'PAYMNT',
          defendant_account_number: '2500000BV',
          defendant_account_id: '123123',
        },
      },
      {
        type: 'Financial',
        amount: '-25',
        postedDetails: {
          posted_by_name: 'Debit user',
          posted_date: '2025-03-11T08:30:00.124Z',
        },
        details: {
          transaction_type: 'CHEQUE',
          payment_reference: 'CHQ123',
        },
      },
      {
        type: 'Notes',
        postedDetails: {
          posted_by_name: 'Notes user',
          posted_date: '2025-03-10T09:15:00.000Z',
        },
        details: {
          noteText: 'Note without a financial amount.',
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_EDGE_CASE_RENDERING_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: '6',
    history_items: [
      {
        type: 'Amendment',
        postedDetails: {
          posted_by_name: 'Case worker',
          posted_date: '2025-04-01T09:00:00.000Z',
        },
        details: {
          attribute_name: 'Payment terms amount',
          old_value: '£100.00',
          new_value: '£9999999999.99',
        },
      },
      {
        type: 'Notes',
        postedDetails: {
          posted_by_name: 'Notes user',
          posted_date: '2025-03-31T10:00:00.000Z',
        },
        details: {
          note_text: `Template-like text: {section} <value> [optional] | pipe - hyphen "quote" & apostrophe`,
        },
      },
      {
        type: 'Financial',
        amount: '100',
        postedDetails: {
          posted_by_name: 'BACS user',
          posted_date: '2025-03-30T10:00:00.000Z',
        },
        details: {
          transaction_type: 'BACS',
          payment_reference: 'BACS123',
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSFORMED_DETAILS_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: '7',
    historyItems: [
      {
        type: 'Financial',
        amount: 50,
        postedDetails: {
          posted_by_name: 'Finance officer',
          posted_date: '2025-03-12T08:30:00.124Z',
        },
        details: {
          line1: [
            {
              fragments: [{ text: 'Repayment', bold: false, hyphen: false }],
            },
            {
              fragments: [
                { text: 'Defendant account:', bold: false, hyphen: false },
                {
                  text: '2500000BV',
                  bold: true,
                  hyphen: true,
                  link: {
                    type: 'account',
                    emit: '123123',
                  },
                },
              ],
            },
          ],
          line2: [{ fragments: [{ text: 'Additional repayment note', bold: false, hyphen: false }] }],
        },
      },
      {
        type: 'Notes',
        postedDetails: {
          posted_by_name: 'Notes user',
          posted_date: '2025-03-11T09:15:00.000Z',
        },
        details: {
          line1: [
            {
              fragments: [{ text: 'Plain note part 1', bold: false, hyphen: false }],
            },
            {
              fragments: [{ text: 'Plain note part 2', bold: false, hyphen: false }],
            },
          ],
          line2: null,
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_MINOR_CREDITOR_HISTORY_AND_NOTES_LARGE_RESULTS_MOCK: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData =
  {
    version: '8',
    history_items: Array.from({ length: 250 }, (_, index) => ({
      type: 'Notes',
      postedDetails: {
        posted_by_name: `Bulk user ${index + 1}`,
        posted_date: new Date(BULK_HISTORY_BASE_TIMESTAMP + index * 60_000).toISOString(),
      },
      details: {
        note_text: `Bulk note ${index + 1}`,
      },
    })),
  };
