import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';

const BULK_HISTORY_BASE_TIMESTAMP = Date.UTC(2025, 0, 1, 12, 0, 0, 0);

export const ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_DATE_SORTING_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
  {
    version: '1',
    history_items: [
      {
        type: 'Note',
        created_at: '2025-03-11T23:59:59.999Z',
        created_by: 'Oldest day user',
        details: {
          noteText: 'Oldest day note',
        },
      },
      {
        type: 'Note',
        created_at: '2025-03-12T12:00:00.100Z',
        created_by: 'Older milliseconds user',
        details: {
          noteText: 'Older same-day note',
        },
      },
      {
        type: 'Note',
        created_at: '2025-03-12T12:00:00.900Z',
        created_by: 'Newest milliseconds user',
        details: {
          noteText: 'Newest same-day note',
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_TABLE_CONTENT_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
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
            transactionType: 'CONSOL',
          },
          accountNumber: '2500000BV',
          associatedRecordId: '123123',
        },
      },
      {
        type: 'Note',
        postedDetails: {
          posted_by_name: 'Notes user',
          posted_date: '2025-03-11T09:15:00.000Z',
        },
        details: {
          noteText: 'Customer called to confirm payment.',
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_EMPTY_RESULTS_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
  {
    version: '2',
    history_items: [],
  };

export const ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_DETAILS_RENDERING_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
  {
    version: '4',
    history_items: [
      {
        type: 'Enforcement',
        postedDetails: {
          posted_by_name: 'Enforcement user',
          posted_date: '2025-10-23T10:00:00.000Z',
        },
        details: {
          enforcementAction: 'REW',
          hearingDate: '2025-10-23',
          hearingCourt: {
            court_id: 1,
            court_name: 'Brent magistrates court',
          },
          caseNumber: '2500000',
          reason: 'Summoned to give cause for non payment',
        },
      },
      {
        type: 'Financial',
        postedDetails: {
          posted_by_name: 'Finance officer',
          posted_date: '2025-03-12T08:30:00.124Z',
        },
        details: {
          transactionType: {
            transactionType: 'CONSOL',
          },
          accountNumber: '2500000BV',
          associatedRecordId: '123123',
        },
      },
      {
        type: 'Amendment',
        postedDetails: {
          posted_by_name: 'Case worker',
          posted_date: '2025-01-05T09:00:00.000Z',
        },
        details: {
          attributeName: 'First name',
          oldValue: 'John',
          newValue: 'Johnny',
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_AMOUNT_ACCESSIBILITY_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
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
          transactionType: {
            transactionType: 'CONSOL',
          },
          accountNumber: '2500000BV',
          associatedRecordId: '123123',
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
          transactionType: {
            transactionType: 'REVPA',
          },
          impositionCode: 'FO',
          associatedRecordId: 'IMP-3',
        },
      },
      {
        type: 'Note',
        postedDetails: {
          posted_by_name: 'Notes user',
          posted_date: '2025-03-10T09:15:00.000Z',
        },
        details: {
          noteText: 'Customer called to confirm payment.',
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_EDGE_CASE_RENDERING_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
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
          attributeName: 'Payment terms amount',
          oldValue: '£100.00',
          newValue: '£9999999999.99',
        },
      },
      {
        type: 'Enforcement',
        postedDetails: {
          posted_by_name: 'Enforcement user',
          posted_date: '2025-03-31T10:00:00.000Z',
        },
        details: {
          enforcementAction: 'BWTD',
          hearingDate: '2025-10-23',
          hearingCourt: {
            court_id: 1,
            court_name: 'Brent & Harrow <Magistrates> "Court"',
          },
          caseNumber: "Case 'A' & B",
          reason: `Defendant said "can't pay" & requested <review>`,
        },
      },
    ],
  };

export const ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_LARGE_RESULTS_MOCK: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData =
  {
    version: '3',
    history_items: Array.from({ length: 250 }, (_, index) => ({
      type: 'Note',
      postedDetails: {
        posted_by_name: `Bulk user ${index + 1}`,
        posted_date: new Date(BULK_HISTORY_BASE_TIMESTAMP + index * 60_000).toISOString(),
      },
      details: {
        noteText: `Bulk note ${index + 1}`,
      },
    })),
  };
