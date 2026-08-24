import { describe, expect, it } from 'vitest';
import { transformMajorCreditorTransactionDetails } from './fines-acc-payload-transform-major-creditor-history-and-notes.utils';

describe('transformMajorCreditorTransactionDetails', () => {
  it('creates BACS details with the optional payment reference', () => {
    const result = transformMajorCreditorTransactionDetails({
      type: 'financial',
      details: {
        transactionType: {
          transactionType: 'BACS',
        },
        paymentReference: 'MJH0000004',
      },
    });

    expect(result).toEqual({
      line1: [
        {
          fragments: [
            {
              text: 'BACS payment',
              bold: false,
              hyphen: false,
            },
          ],
        },
        {
          fragments: [
            {
              text: 'Payment reference:',
              bold: true,
              hyphen: false,
            },
            {
              text: 'MJH0000004',
              bold: false,
              hyphen: false,
            },
          ],
        },
      ],
      line2: null,
    });
  });

  it('omits the payment-reference part when the backend provides no reference', () => {
    const result = transformMajorCreditorTransactionDetails({
      type: 'financial',
      details: {
        transactionType: 'BACS',
        paymentReference: null,
      },
    });

    expect(result).toEqual({
      line1: [
        {
          fragments: [
            {
              text: 'BACS payment',
              bold: false,
              hyphen: false,
            },
          ],
        },
      ],
      line2: null,
    });
  });
});
