import { describe, expect, it } from 'vitest';
import {
  transformMinorCreditorAmendmentDetails,
  transformMinorCreditorGeneratedOrderAndNoticeDetails,
  transformMinorCreditorNoteDetails,
  transformMinorCreditorTransactionDetails,
} from './fines-acc-payload-transform-minor-creditor-history-and-notes.utils';

const fragment = (text: string, bold = false) => ({ text, bold, hyphen: false });
const part = (...fragments: ReturnType<typeof fragment>[]) => ({ fragments });
const details = (...line1: ReturnType<typeof part>[]) => ({ line1, line2: null });

describe('transformMinorCreditorAmendmentDetails', () => {
  it('should transform amendment details with bold field and values', () => {
    const result = transformMinorCreditorAmendmentDetails({
      details: {
        attribute_name: 'Payment hold',
        old_value: 'No',
        new_value: 'Yes',
      },
    });

    expect(result).toEqual(
      details(
        part(fragment('Payment hold', true)),
        part(fragment('Old:'), fragment('No', true)),
        part(fragment('New:'), fragment('Yes', true)),
      ),
    );
  });

  it('should omit missing amendment old and new values', () => {
    const result = transformMinorCreditorAmendmentDetails({
      details: {
        attributeName: 'Status',
        oldValue: null,
        newValue: '',
      },
    });

    expect(result).toEqual(details(part(fragment('Status', true))));
  });

  it('should omit missing amendment field names', () => {
    const result = transformMinorCreditorAmendmentDetails({
      details: {
        old_value: 'One',
        new_value: 'Two',
      },
    });

    expect(result).toEqual(
      details(part(fragment('Old:'), fragment('One', true)), part(fragment('New:'), fragment('Two', true))),
    );
  });
});

describe('transformMinorCreditorNoteDetails', () => {
  it('should transform note details', () => {
    const result = transformMinorCreditorNoteDetails({
      details: {
        note_text: 'Minor creditor account note',
      },
    });

    expect(result).toEqual(details(part(fragment('Minor creditor account note'))));
  });

  it('should preserve special characters as literal note text', () => {
    const noteText = 'Template-like text: {section} <value> [optional] | pipe - hyphen ¶ line marker';

    const result = transformMinorCreditorNoteDetails({
      details: {
        note_text: noteText,
      },
    });

    expect(result).toEqual(details(part(fragment(noteText))));
  });
});

describe('transformMinorCreditorTransactionDetails', () => {
  it('should transform BACS payment details with payment reference', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'BACS',
        payment_reference: 'BACS123',
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'BACS payment', bold: false, hyphen: false }] },
        {
          fragments: [
            { text: 'Payment reference:', bold: false, hyphen: false },
            { text: 'BACS123', bold: false, hyphen: false },
          ],
        },
      ],
      line2: null,
    });
  });

  it('should transform cheque details with not yet written fallback', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'CHEQUE',
        payment_reference: null,
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'Cheque issued', bold: false, hyphen: false }] },
        {
          fragments: [
            { text: 'Cheque number:', bold: false, hyphen: false },
            { text: 'Not yet written', bold: false, hyphen: false },
          ],
        },
      ],
      line2: null,
    });
  });

  it('should transform court fee details', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'CFEES',
      },
    });

    expect(result).toEqual({
      line1: [{ fragments: [{ text: 'Court Fee', bold: false, hyphen: false }] }],
      line2: null,
    });
  });

  it('should transform licensing fee details', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'LIFEES',
      },
    });

    expect(result).toEqual({
      line1: [{ fragments: [{ text: 'Licensing Fee', bold: false, hyphen: false }] }],
      line2: null,
    });
  });

  it('should transform cheque details with cancelled status and formatted status date', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'CHEQUE',
        payment_reference: 'CHQ123',
        status: 'X',
        status_date: '2024-01-31',
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'Cheque issued', bold: false, hyphen: false }] },
        {
          fragments: [
            { text: 'Cheque number:', bold: false, hyphen: false },
            { text: 'CHQ123', bold: false, hyphen: false },
          ],
        },
        { fragments: [{ text: 'Cheque cancelled 31/01/2024', bold: false, hyphen: false }] },
      ],
      line2: null,
    });
  });

  it('should transform cheque details with nested creditor transaction status', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'CHEQUE',
        payment_reference: 'CHQ123',
        status: {
          creditorTransactionStatus: 'X',
          creditorTransactionStatusDisplayName: 'Cancelled',
        },
        status_date: '2024-01-31',
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'Cheque issued', bold: false, hyphen: false }] },
        {
          fragments: [
            { text: 'Cheque number:', bold: false, hyphen: false },
            { text: 'CHQ123', bold: false, hyphen: false },
          ],
        },
        { fragments: [{ text: 'Cheque cancelled 31/01/2024', bold: false, hyphen: false }] },
      ],
      line2: null,
    });
  });

  it('should transform repayment details with creditor account number', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'REPAYF',
        creditor_account_number: 'MC12345',
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'Repayment', bold: false, hyphen: false }] },
        { fragments: [{ text: 'MC12345', bold: false, hyphen: false }] },
      ],
      line2: null,
    });
  });

  it('should transform repayment from suspense details with associated record ID', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'REPSUS',
        associated_record_id: 'SUSP123',
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'Repayment from suspense', bold: false, hyphen: false }] },
        { fragments: [{ text: 'SUSP123', bold: false, hyphen: false }] },
      ],
      line2: null,
    });
  });

  it('should transform suspense transfer details using defendant account number for defendant transaction records', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'XFER',
        associated_record_type: 'defendant_transaction',
        defendant_account_number: 'DA12345',
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'Suspense transfer', bold: false, hyphen: false }] },
        { fragments: [{ text: 'DA12345', bold: false, hyphen: false }] },
      ],
      line2: null,
    });
  });

  it('should transform suspense transfer details using associated record ID for suspense item records', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'XFER',
        associated_record_type: 'suspense_item',
        associated_record_id: 'SUSP123',
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'Suspense transfer', bold: false, hyphen: false }] },
        { fragments: [{ text: 'SUSP123', bold: false, hyphen: false }] },
      ],
      line2: null,
    });
  });

  it('should transform suspense transfer details using creditor account number for creditor account records', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'XFER',
        associated_record_type: 'creditor_accounts',
        creditor_account_number: 'MC12345',
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'Suspense transfer', bold: false, hyphen: false }] },
        { fragments: [{ text: 'MC12345', bold: false, hyphen: false }] },
      ],
      line2: null,
    });
  });

  it('should transform cancelled cheque details with payment reference', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'CANCHQ',
        payment_reference: '5429',
      },
    });

    expect(result).toEqual(
      details(part(fragment('Cheque cancelled')), part(fragment('Cheque number:'), fragment('5429'))),
    );
  });

  it.each([
    ['RIBACS', 'BACS payment reissued'],
    ['RTBACS', 'BACS payment cancelled'],
  ])('should transform %s BACS details with payment reference', (transactionType, label) => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: transactionType,
        payment_reference: '10000291',
      },
    });

    expect(result).toEqual(details(part(fragment(label)), part(fragment('Payment reference:'), fragment('10000291'))));
  });

  it('should transform reissued cheque details with dishonoured status and no status date', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'RICHEQ',
        payment_reference: '524589',
        status: 'D',
      },
    });

    expect(result).toEqual(
      details(
        part(fragment('Cheque reissued')),
        part(fragment('Cheque number:'), fragment('524589')),
        part(fragment('Cheque dishonoured')),
      ),
    );
  });

  it('should omit cheque status for unrecognised status values', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'CHEQUE',
        payment_reference: '524589',
        status: 'C',
      },
    });

    expect(result).toEqual(
      details(part(fragment('Cheque issued')), part(fragment('Cheque number:'), fragment('524589'))),
    );
  });

  it('should transform repayment details for each creditor repayment transaction type', () => {
    ['REPAYC', 'REPAYF', 'REPAYM', 'REPAYP', 'REPAYV', 'REPAYW'].forEach((transactionType) => {
      const result = transformMinorCreditorTransactionDetails({
        details: {
          transaction_type: transactionType,
          creditor_account_number: '250000123M',
        },
      });

      expect(result).toEqual(details(part(fragment('Repayment')), part(fragment('250000123M'))));
    });
  });

  it('should transform historic licensing repayment details without an account number', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'REPLIC',
      },
    });

    expect(result).toEqual(details(part(fragment('Repayment'))));
  });

  it('should transform manual adjustment details with defendant account number', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transactionType: {
          transactionType: 'MADJ',
        },
        defendantAccountNumber: '250000123M',
      },
    });

    expect(result).toEqual(details(part(fragment('Manual adjustment')), part(fragment('250000123M'))));
  });

  it('should transform payment received details when defendant account number is omitted', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transactionType: {
          transactionType: 'PAYMNT',
          transactionTypeDisplayName: 'PAYMNT',
        },
        defendantAccountNumber: null,
      },
    });

    expect(result).toEqual(details(part(fragment('Payment received'))));
  });

  it('should fall back to associated record ID for suspense transfer with unknown associated record type', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'XFER',
        associated_record_type: 'other_record',
        associated_record_id: 'ASSOC123',
        defendant_account_number: 'DA12345',
        creditor_account_number: 'MC12345',
      },
    });

    expect(result).toEqual(details(part(fragment('Suspense transfer')), part(fragment('ASSOC123'))));
  });

  it('should fall back to defendant account number for suspense transfer when associated record ID is omitted', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'XFER',
        associated_record_type: 'other_record',
        defendant_account_number: 'DA12345',
        creditor_account_number: 'MC12345',
      },
    });

    expect(result).toEqual(details(part(fragment('Suspense transfer')), part(fragment('DA12345'))));
  });

  it('should fall back to creditor account number for suspense transfer when associated and defendant values are omitted', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'XFER',
        associated_record_type: 'other_record',
        creditor_account_number: 'MC12345',
      },
    });

    expect(result).toEqual(details(part(fragment('Suspense transfer')), part(fragment('MC12345'))));
  });

  it('should transform unknown transaction details using description and payment reference', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'UNKNOWN',
        transaction_description: 'Unknown transaction',
        payment_reference: 'REF123',
      },
    });

    expect(result).toEqual(
      details(part(fragment('Unknown transaction')), part(fragment('Reference:'), fragment('REF123'))),
    );
  });

  it('should transform unknown transaction details using transaction type when description is omitted', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transaction_type: 'UNKNOWN',
      },
    });

    expect(result).toEqual(details(part(fragment('UNKNOWN'))));
  });

  it('should transform transaction details using description when transaction type is omitted', () => {
    const result = transformMinorCreditorTransactionDetails({
      details: {
        transactionDescription: 'Description only',
      },
    });

    expect(result).toEqual(details(part(fragment('Description only'))));
  });
});

describe('transformMinorCreditorGeneratedOrderAndNoticeDetails', () => {
  it('should transform generated order and notice details with document fields', () => {
    const result = transformMinorCreditorGeneratedOrderAndNoticeDetails({
      details: {
        document_id: 'NOA',
        document_title: 'Notice of account',
        document_instance_id: '123456',
        status: 'downloaded',
      },
    });

    expect(result).toEqual({
      line1: [
        { fragments: [{ text: 'Notice of account', bold: false, hyphen: false }] },
        {
          fragments: [
            { text: 'Document code:', bold: false, hyphen: false },
            { text: 'NOA', bold: false, hyphen: false },
          ],
        },
        {
          fragments: [
            { text: 'Document instance ID:', bold: false, hyphen: false },
            { text: '123456', bold: false, hyphen: false },
          ],
        },
        {
          fragments: [
            { text: 'Status:', bold: false, hyphen: false },
            { text: 'downloaded', bold: false, hyphen: false },
          ],
        },
      ],
      line2: null,
    });
  });

  it('should fall back to document type and omit missing labels', () => {
    const result = transformMinorCreditorGeneratedOrderAndNoticeDetails({
      details: {
        document_type: 'Order and notice',
      },
    });

    expect(result).toEqual(details(part(fragment('Order and notice'))));
  });
});
