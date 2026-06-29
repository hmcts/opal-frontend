import { describe, expect, it } from 'vitest';
import { transformMinorCreditorTransactionDetails } from './fines-acc-payload-transform-minor-creditor-history-and-notes.utils';

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
});
