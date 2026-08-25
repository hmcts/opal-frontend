import { describe, expect, it } from 'vitest';
import { transformMajorCreditorTransactionDetails } from './fines-acc-payload-transform-major-creditor-history-and-notes.utils';

const fragment = (text: string, link?: { type: string; emit: string }) => ({
  text,
  bold: false,
  hyphen: false,
  ...(link ? { link } : {}),
});

const part = (...fragments: ReturnType<typeof fragment>[]) => ({ fragments });

const details = (...line1: ReturnType<typeof part>[]) => ({ line1, line2: null });

describe('transformMajorCreditorTransactionDetails', () => {
  it('should link a payment received defendant account number when an account ID is supplied', () => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType: 'PAYMNT' },
        defendantAccountNumber: '250000123M',
        defendantAccountId: '123123',
      },
    });

    expect(result).toEqual(
      details(part(fragment('Payment received')), part(fragment('250000123M', { type: 'account', emit: '123123' }))),
    );
  });

  it('should omit the optional manual adjustment account part when the response supplies null values', () => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType: 'MADJ' },
        defendantAccountNumber: null,
        defendantAccountId: null,
      },
    });

    expect(result).toEqual(details(part(fragment('Manual adjustment'))));
  });

  it('should keep a visible defendant account number as plain text when its link target is absent', () => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType: 'MADJ' },
        defendantAccountNumber: '250000123M',
        defendantAccountId: null,
      },
    });

    expect(result).toEqual(details(part(fragment('Manual adjustment')), part(fragment('250000123M'))));
  });

  it('should link a repayment from suspense to its suspense transaction', () => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType: 'REPSUS' },
        associatedRecordId: 'SUSP-123',
      },
    });

    expect(result).toEqual(
      details(
        part(fragment('Repayment from suspense')),
        part(fragment('SUSP-123', { type: 'suspenseTransaction', emit: 'SUSP-123' })),
      ),
    );
  });

  it('should link a suspense transfer defendant account to its account ID', () => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType: 'XFER' },
        associatedRecordType: 'defendant_transaction',
        defendantAccountNumber: '250000123M',
        defendantAccountId: '123123',
      },
    });

    expect(result).toEqual(
      details(part(fragment('Suspense transfer')), part(fragment('250000123M', { type: 'account', emit: '123123' }))),
    );
  });

  it('should link a suspense transfer suspense transaction to its associated record ID', () => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType: 'XFER' },
        associatedRecordType: 'suspense_item',
        associatedRecordId: 'SUSP-123',
      },
    });

    expect(result).toEqual(
      details(
        part(fragment('Suspense transfer')),
        part(fragment('SUSP-123', { type: 'suspenseTransaction', emit: 'SUSP-123' })),
      ),
    );
  });

  it('should link a suspense transfer creditor account number to its associated record ID', () => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType: 'XFER' },
        associatedRecordType: 'creditor_accounts',
        accountNumber: '99000000000850',
        associatedRecordId: '850',
      },
    });

    expect(result).toEqual(
      details(part(fragment('Suspense transfer')), part(fragment('99000000000850', { type: 'account', emit: '850' }))),
    );
  });
});
