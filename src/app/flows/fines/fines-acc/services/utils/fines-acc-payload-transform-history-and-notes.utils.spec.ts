import { describe, expect, it } from 'vitest';
import {
  createHistoryAndNotesDetailsPart,
  transformHistoryAndNotesDetails,
  transformHistoryAndNotesItems,
} from './fines-acc-payload-transform-history-and-notes.utils';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS } from '../constants/fines-acc-history-and-notes-details-transformers.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_TYPE_CODES } from '../constants/fines-acc-history-and-notes-details-payment-terms-type-codes.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES } from '../constants/fines-acc-history-and-notes-details-transaction-types.constant';
import { FINES_ACC_HISTORY_AND_NOTES_AMENDMENT_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-amendment-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_AMENDMENT_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-amendment-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_CHEQUE_TRANSACTION_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-cheque-transaction-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_CHEQUE_TRANSACTION_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-cheque-transaction-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_CONSOLIDATION_TRANSACTION_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-consolidation-transaction-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_CONSOLIDATION_TRANSACTION_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-consolidation-transaction-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_DISHONOURED_CHEQUE_IMPOSITION_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-dishonoured-cheque-imposition-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_DISHONOURED_CHEQUE_IMPOSITION_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-dishonoured-cheque-imposition-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_BWTD_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-bwtd-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_BWTD_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-bwtd-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_DW_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-dw-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_DW_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-dw-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_HEARING_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-hearing-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_HEARING_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-hearing-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_ISO_DATETIME_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-iso-datetime-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_ISO_DATETIME_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-iso-datetime-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_WARRANT_NO_REASON_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-warrant-no-reason-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_WARRANT_NO_REASON_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-enforcement-warrant-no-reason-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_NOTE_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-note-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_NOTE_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-note-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_NUMERIC_STRING_AMOUNT_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-payment-terms-numeric-string-amount-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_NUMERIC_STRING_AMOUNT_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-payment-terms-numeric-string-amount-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_PREFORMATTED_AMOUNT_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-payment-terms-preformatted-amount-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_PREFORMATTED_AMOUNT_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-payment-terms-preformatted-amount-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_TEXT_AMOUNT_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-payment-terms-text-amount-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_TEXT_AMOUNT_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-payment-terms-text-amount-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-payment-terms-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-payment-terms-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_REVERSED_WRITE_OFF_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-reversed-write-off-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_REVERSED_WRITE_OFF_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-reversed-write-off-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_STRUCTURED_NOTE_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-structured-note-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_STRUCTURED_NOTE_TRANSFORMED_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-structured-note-transformed-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_SUSPENSE_TRANSFER_CAMEL_RECORD_TYPE_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-suspense-transfer-camel-record-type-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_SUSPENSE_TRANSFER_CAMEL_RECORD_TYPE_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-suspense-transfer-camel-record-type-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_TFO_IN_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-tfo-in-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_TFO_IN_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-tfo-in-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_TRANSFER_WITHOUT_ASSOCIATED_RECORD_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-transfer-without-associated-record-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_TRANSFER_WITHOUT_ASSOCIATED_RECORD_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-transfer-without-associated-record-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_UNSUPPORTED_ORDERS_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-unsupported-orders-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_UNSUPPORTED_ORDERS_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-unsupported-orders-item.mock';
import { FINES_ACC_HISTORY_AND_NOTES_WRITE_OFF_CONSOLIDATED_ACCOUNT_DETAILS_MOCK } from './mocks/fines-acc-history-and-notes-write-off-consolidated-account-details.mock';
import { FINES_ACC_HISTORY_AND_NOTES_WRITE_OFF_CONSOLIDATED_ACCOUNT_ITEM_MOCK } from './mocks/fines-acc-history-and-notes-write-off-consolidated-account-item.mock';

const fragment = (
  text: string,
  options: { bold?: boolean; hyphen?: boolean; link?: { type: string; emit: string } } = {},
) => ({
  text,
  bold: options.bold ?? false,
  hyphen: options.hyphen ?? false,
  ...(options.link ? { link: options.link } : {}),
});

const part = (...fragments: ReturnType<typeof fragment>[]) => ({ fragments });

describe('transformHistoryAndNotesDetails', () => {
  it('should transform amendment details into pipe-separated parts with bold labels', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_AMENDMENT_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_AMENDMENT_DETAILS_MOCK);
  });

  it('should transform enforcement details with hyphen fragments and secondary reason text', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_HEARING_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_HEARING_DETAILS_MOCK);
  });

  it('should keep enforcement line2 null when there is no secondary reason text', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_WARRANT_NO_REASON_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_WARRANT_NO_REASON_DETAILS_MOCK);
  });

  it('should transform nested enforcement details from the account history API shape', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_DW_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_DW_DETAILS_MOCK);
  });

  it('should transform the enforcement reason into line2 for warrant and hearing actions', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_BWTD_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_BWTD_DETAILS_MOCK);
  });

  it('should transform enforcement ISO datetime dates using the date service ISO fallback', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_ISO_DATETIME_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_ISO_DATETIME_DETAILS_MOCK);
  });

  it('should transform note details and leave line2 as null', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_NOTE_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_NOTE_DETAILS_MOCK);
  });

  it('should transform payment terms using mapped instalment period labels and line2 reason text', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_DETAILS_MOCK);
  });

  it('should preserve preformatted payment terms amounts and unknown date text', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_PREFORMATTED_AMOUNT_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_PREFORMATTED_AMOUNT_DETAILS_MOCK);
  });

  it('should format numeric string payment terms amounts as currency', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_NUMERIC_STRING_AMOUNT_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_NUMERIC_STRING_AMOUNT_DETAILS_MOCK);
  });

  it('should preserve non-numeric payment terms amount text', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_TEXT_AMOUNT_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_TEXT_AMOUNT_DETAILS_MOCK);
  });

  it('should transform account consolidation transaction details with an account link fragment', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_CONSOLIDATION_TRANSACTION_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_CONSOLIDATION_TRANSACTION_DETAILS_MOCK);
  });

  it('should transform cheque transaction details with status text and formatted status date', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_CHEQUE_TRANSACTION_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_CHEQUE_TRANSACTION_DETAILS_MOCK);
  });

  it('should transform dishonoured cheque imposition details', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_DISHONOURED_CHEQUE_IMPOSITION_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_DISHONOURED_CHEQUE_IMPOSITION_DETAILS_MOCK);
  });

  it('should omit the linked associated record part when the transaction has no associated record id', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_TRANSFER_WITHOUT_ASSOCIATED_RECORD_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_TRANSFER_WITHOUT_ASSOCIATED_RECORD_DETAILS_MOCK);
  });

  it('should transform reversed write-off additional information into line2', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_REVERSED_WRITE_OFF_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_REVERSED_WRITE_OFF_DETAILS_MOCK);
  });

  it('should transform TFO in originator details', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_TFO_IN_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_TFO_IN_DETAILS_MOCK);
  });

  it('should transform write-off details for consolidated defendant accounts', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_WRITE_OFF_CONSOLIDATED_ACCOUNT_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_WRITE_OFF_CONSOLIDATED_ACCOUNT_DETAILS_MOCK);
  });

  it('should resolve suspense transfer reasons from camel case associated record types', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_SUSPENSE_TRANSFER_CAMEL_RECORD_TYPE_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_SUSPENSE_TRANSFER_CAMEL_RECORD_TYPE_DETAILS_MOCK);
  });

  it('should transform items by replacing raw details with structured details', () => {
    const result = transformHistoryAndNotesItems(
      [FINES_ACC_HISTORY_AND_NOTES_STRUCTURED_NOTE_ITEM_MOCK],
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual([FINES_ACC_HISTORY_AND_NOTES_STRUCTURED_NOTE_TRANSFORMED_ITEM_MOCK]);
  });

  it('should fall back to the item type for unsupported history item types', () => {
    const result = transformHistoryAndNotesDetails(
      FINES_ACC_HISTORY_AND_NOTES_UNSUPPORTED_ORDERS_ITEM_MOCK,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual(FINES_ACC_HISTORY_AND_NOTES_UNSUPPORTED_ORDERS_DETAILS_MOCK);
  });

  it('should return empty fallback details when the item type is missing', () => {
    const result = transformHistoryAndNotesDetails(
      { details: { noteText: 'No type' } },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({ line1: [], line2: null });
  });

  it('should return null when a details part has no visible fragments', () => {
    expect(createHistoryAndNotesDetailsPart([fragment('')])).toBeNull();
  });

  it('should ignore record values when scalar text is expected', () => {
    const result = transformHistoryAndNotesDetails(
      { type: 'Note', details: { noteText: { text: 'Nested note text' } } },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({ line1: [], line2: null });
  });

  it('should fall back to the item type when a financial item has no transaction type', () => {
    const result = transformHistoryAndNotesDetails(
      { type: 'Financial', details: {} },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [part(fragment('Financial'))],
      line2: null,
    });
  });

  it('should normalise transaction types and use not-yet-written cheque number fallback text', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          transactionType: {
            transactionType: ` ${FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.cancelledCheque.toLowerCase()} `,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [
        part(fragment('Cheque cancelled')),
        part(fragment('Cheque number:', { bold: true }), fragment('Not yet written')),
      ],
      line2: null,
    });
  });

  it('should omit cheque status text when the status is absent or unmapped', () => {
    const noStatusResult = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          paymentReference: '100001',
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.cheque,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );
    const unmappedStatusResult = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          paymentReference: '100002',
          status: {
            defendantTransactionStatus: 'UNKNOWN',
          },
          statusDate: '2025-11-10',
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.cheque,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(noStatusResult).toEqual({
      line1: [part(fragment('Cheque issued')), part(fragment('Cheque number:', { bold: true }), fragment('100001'))],
      line2: null,
    });
    expect(unmappedStatusResult).toEqual({
      line1: [part(fragment('Cheque issued')), part(fragment('Cheque number:', { bold: true }), fragment('100002'))],
      line2: null,
    });
  });

  it('should transform the remaining transaction type branches', () => {
    const cases = [
      {
        item: {
          type: 'Financial',
          details: {
            associatedRecordId: 'SUSP-1',
            transactionType: {
              transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.manualAdjustment,
            },
          },
        },
        expected: {
          line1: [
            part(fragment('Manual adjustment')),
            part(fragment('SUSP-1', { link: { type: 'suspenseTransaction', emit: 'SUSP-1' } })),
          ],
          line2: null,
        },
      },
      {
        item: {
          type: 'Financial',
          details: {
            associatedRecordId: 'SUSP-2',
            transactionType: {
              transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.repaymentFromSuspense,
            },
          },
        },
        expected: {
          line1: [
            part(fragment('Repayment from suspense')),
            part(fragment('SUSP-2', { link: { type: 'suspenseTransaction', emit: 'SUSP-2' } })),
          ],
          line2: null,
        },
      },
      {
        item: {
          type: 'Financial',
          details: {
            additionalInformation: 'Paid at counter',
            paymentMethod: {
              paymentMethod: 'Cash',
            },
            paymentReference: 'PAY-1',
            transactionType: {
              transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.payment,
            },
          },
        },
        expected: {
          line1: [
            part(fragment('Payment received')),
            part(fragment('Cash')),
            part(fragment('Paid at counter')),
            part(fragment('PAY-1')),
          ],
          line2: null,
        },
      },
      {
        item: {
          type: 'Financial',
          details: {
            associatedRecordId: 'IMP-3',
            impositionCode: 'FO',
            transactionType: {
              transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.reversedPayment,
            },
          },
        },
        expected: {
          line1: [
            part(fragment('Payment reversed')),
            part(fragment('FO')),
            part(fragment('IMP-3', { link: { type: 'imposition', emit: 'IMP-3' } })),
          ],
          line2: null,
        },
      },
      {
        item: {
          type: 'Financial',
          details: {
            paymentReference: 'CHQ-1',
            transactionType: {
              transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.reissuedCheque,
            },
          },
        },
        expected: {
          line1: [
            part(fragment('Cheque reissued')),
            part(fragment('Cheque number:', { bold: true }), fragment('CHQ-1')),
          ],
          line2: null,
        },
      },
      {
        item: {
          type: 'Financial',
          details: {
            additionalInformation: 'Central Fund',
            transactionType: {
              transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.tfoOut,
            },
          },
        },
        expected: {
          line1: [
            part(fragment('TFO out')),
            part(fragment('Transferred to:', { bold: true }), fragment('Central Fund')),
          ],
          line2: null,
        },
      },
    ];

    for (const { item, expected } of cases) {
      expect(transformHistoryAndNotesDetails(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS)).toEqual(expected);
    }
  });

  it('should transform payment terms in-full, paid and unsupported type branches', () => {
    const inFullResult = transformHistoryAndNotesDetails(
      {
        type: 'Payment terms',
        details: {
          effective_date: '2025-11-10',
          payment_terms_type: {
            payment_terms_type_code: FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_TYPE_CODES.inFull,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );
    const paidResult = transformHistoryAndNotesDetails(
      {
        type: 'Payment terms',
        details: {
          effective_date: '2025-11-10',
          payment_terms_type: {
            payment_terms_type_code: FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_TYPE_CODES.paid,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );
    const unsupportedResult = transformHistoryAndNotesDetails(
      {
        type: 'Payment terms',
        details: {
          payment_terms_type: {
            payment_terms_type_code: 'UNKNOWN',
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(inFullResult).toEqual({
      line1: [
        part(fragment('In full')),
        part(fragment('Due by:', { bold: true }), fragment('10/11/2025')),
        part(fragment('Instalments:', { bold: true }), fragment('10/11/2025')),
      ],
      line2: null,
    });
    expect(paidResult).toEqual({
      line1: [
        part(fragment('Paid:', { bold: true }), fragment('10/11/2025')),
        part(fragment('Instalments:', { bold: true }), fragment('10/11/2025')),
      ],
      line2: null,
    });
    expect(unsupportedResult).toEqual({ line1: [], line2: null });
  });

  it('should preserve unmapped instalment periods in payment terms details', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Payment terms',
        details: {
          effective_date: '2025-11-10',
          instalment_amount: 15,
          instalment_period: {
            instalment_period_code: 'FORTNIGHTLY',
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [
        part(
          fragment('Instalments:', { bold: true }),
          fragment('£15.00'),
          fragment('FORTNIGHTLY'),
          fragment('10/11/2025'),
        ),
      ],
      line2: null,
    });
  });

  it('should transform partial hearing details without adding missing fragments', () => {
    const hearingDateOnlyResult = transformHistoryAndNotesDetails(
      {
        type: 'Enforcement',
        details: {
          enforcementAction: 'Hearing listed',
          hearingDate: '2025-11-10',
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );
    const hearingCourtOnlyResult = transformHistoryAndNotesDetails(
      {
        type: 'Enforcement',
        details: {
          enforcementAction: 'Hearing listed',
          hearingCourt: {
            court_name: 'Westminster Magistrates Court',
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(hearingDateOnlyResult).toEqual({
      line1: [
        part(fragment('Hearing listed')),
        part(fragment('Hearing:', { bold: true }), fragment('10/11/2025', { hyphen: true })),
      ],
      line2: null,
    });
    expect(hearingCourtOnlyResult).toEqual({
      line1: [
        part(fragment('Hearing listed')),
        part(fragment('Hearing:', { bold: true }), fragment('Westminster Magistrates Court', { hyphen: true })),
      ],
      line2: null,
    });
  });

  it('should use the account number as the account link emit value when related id is missing', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          accountNumber: '2500000BV',
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.consolidation,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [
        part(fragment('Account consolidated')),
        part(fragment('2500000BV', { link: { type: 'account', emit: '2500000BV' } })),
        part(fragment('Amount credited to master account')),
      ],
      line2: null,
    });
  });

  it('should omit the account link when consolidation has no account number', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.consolidation,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [part(fragment('Account consolidated')), part(fragment('Amount credited to master account'))],
      line2: null,
    });
  });

  it('should transform write-off imposition details when the associated record is not a defendant account', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          additionalInformation: 'Write-off approved',
          amountImposed: 40,
          associatedRecordId: 'IMP-1',
          associatedRecordType: 'imposition',
          impositionCode: 'FO',
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.writeOff,
          },
          writeOff: {
            writeOffTypeDisplayName: 'Administrative write-off',
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [
        part(fragment('Write-off')),
        part(fragment('FO'), fragment('£40.00')),
        part(fragment('IMP-1', { link: { type: 'imposition', emit: 'IMP-1' } })),
        part(fragment('Administrative write-off')),
      ],
      line2: [part(fragment('Write-off approved'))],
    });
  });

  it('should omit empty imposition details while retaining the associated record link', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          associatedRecordId: 'IMP-2',
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.dishonouredCheque,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [
        part(fragment('Cheque dishonoured')),
        part(fragment('IMP-2', { link: { type: 'imposition', emit: 'IMP-2' } })),
      ],
      line2: null,
    });
  });

  it('should transform write-off defendant account details without an account number', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          associatedRecordType: 'defendantaccount',
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.writeOff,
          },
          writeOff: {
            writeOffTypeDisplayName: 'Administrative write-off',
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [part(fragment('Write-off')), part(fragment('Administrative write-off'))],
      line2: null,
    });
  });

  it('should use the account number as the consolidated account link emit value when related id is missing', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          accountNumber: '2500000BV',
          associatedRecordType: 'defendantaccount',
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.writeOff,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [
        part(fragment('Write-off')),
        part(
          fragment('Consolidated'),
          fragment('2500000BV', { hyphen: true, link: { type: 'account', emit: '2500000BV' } }),
        ),
      ],
      line2: null,
    });
  });

  it('should use additional information for suspense transfers with no associated record type', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          additionalInformation: 'Manual suspense transfer reason',
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.suspenseTransfer,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [part(fragment('Suspense transfer')), part(fragment('Manual suspense transfer reason'))],
      line2: null,
    });
  });

  it('should use additional information for suspense transfers with unmapped associated record types', () => {
    const result = transformHistoryAndNotesDetails(
      {
        type: 'Financial',
        details: {
          additionalInformation: 'Unmapped suspense transfer reason',
          associatedRecordType: 'unknown transaction',
          transactionType: {
            transactionType: FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES.suspenseTransfer,
          },
        },
      },
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS,
    );

    expect(result).toEqual({
      line1: [part(fragment('Suspense transfer')), part(fragment('Unmapped suspense transfer reason'))],
      line2: null,
    });
  });
});
