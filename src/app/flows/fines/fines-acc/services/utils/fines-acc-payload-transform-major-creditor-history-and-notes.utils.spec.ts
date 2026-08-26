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

const labelValuePart = (label: string, value: string) =>
  part({ text: label, bold: true, hyphen: false }, { text: value, bold: false, hyphen: false });

describe('transformMajorCreditorTransactionDetails', () => {
  it.each([
    ['BACS', 'BACS payment'],
    ['bacs', 'BACS payment'],
    [' BACS ', 'BACS payment'],
    ['RTBACS', 'BACS payment returned'],
    ['RIBACS', 'BACS payment reissued'],
  ])('should transform %s with its payment reference', (transactionType, title) => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType },
        paymentReference: `Reference <${transactionType}> & "quoted"`,
      },
    });

    expect(result).toEqual(
      details(part(fragment(title)), labelValuePart('Payment reference:', `Reference <${transactionType}> & "quoted"`)),
    );
  });

  it('should transform a cancelled cheque with its cheque number', () => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType: 'CANCHQ' },
        paymentReference: '5429',
      },
    });

    expect(result).toEqual(details(part(fragment('Cheque cancelled')), labelValuePart('Cheque number:', '5429')));
  });

  it.each([
    ['CHEQUE', 'Cheque issued', null, null, 'Not yet written', null],
    ['CHEQUE', 'Cheque issued', '524589', 'X', '524589', 'Cheque cancelled 20/06/2026'],
    ['RICHEQ', 'Cheque reissued', '624589', 'D', '624589', 'Cheque dishonoured 20/06/2026'],
    ['RICHEQ', 'Cheque reissued', '724589', 'C', '724589', null],
  ])(
    'should transform %s cheque details with its documented optional status output',
    (transactionType, title, paymentReference, status, chequeNumber, statusText) => {
      const result = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType },
          paymentReference,
          status: { creditorTransactionStatus: status },
          statusDate: '2026-06-20T09:00:00',
        },
      });

      expect(result).toEqual(
        details(
          part(fragment(title)),
          labelValuePart('Cheque number:', chequeNumber),
          ...(statusText ? [part(fragment(statusText))] : []),
        ),
      );
    },
  );

  it.each([
    ['CFEES', 'Court Fee'],
    ['FCC', 'Amount allocated to Fines Court Charge'],
    ['FCMP', 'Amount allocated to Compensation from Scotland/NI'],
    ['FCOST', 'Amount allocated to Costs'],
    ['FCPC', 'Amount allocated to Crown Prosecutions Costs'],
    ['FCST', 'Amount allocated to Cost from Scotland/NI'],
    ['FCUEX', 'Amount allocated to Custom and Excise'],
    ['FCOMP', 'Amount allocated to Compensation'],
    ['FDCON', 'Amount allocated to Contribution to Form D Costs'],
    ['FDCOST', 'Amount allocated to Form D Costs'],
    ['FEES', 'Amount allocated to Fees'],
    ['FFR', 'Amount allocated to Forfeited Recognizance'],
    ['FINE', 'Amount allocated to Fines from Scotland/NI'],
    ['FINES', 'Amount allocated to Fines'],
    ['FIXPEN', 'Amount allocated to Fixed Penalty'],
    ['FLAID', 'Amount allocated to Legal Aid Contribution'],
    ['FNIA', 'Amount allocated to National Insurance Arrears'],
    ['FO', 'Amount allocated to Fine Only'],
    ['FOPR1', 'Amount allocated to Fine 1st Priority'],
    ['FVEA', 'Amount allocated to Vehicle Excise Arrears'],
    ['FVEBD', 'Amount allocated to Vehicle Excise Back Duty'],
    ['FVS', 'Amount allocated to Victim Surcharge'],
    ['FWEC', 'Amount allocated to Witness Expenses'],
    ['LIFEES', 'Licensing Fee'],
    ['PAID', 'Amount due to be paid'],
    ['REPLIC', 'Repayment'],
    ['WO611B', 'Amount allocated to Section 611B write-off'],
  ])('should transform %s into its documented fixed label', (transactionType, label) => {
    const result = transformMajorCreditorTransactionDetails({
      details: { transactionType: { transactionType } },
    });

    expect(result).toEqual(details(part(fragment(label))));
  });

  it.each([
    ['MADJ', 'Manual adjustment'],
    ['PAYMNT', 'Payment received'],
    ['REPAYC', 'Repayment'],
    ['REPAYF', 'Repayment'],
    ['REPAYM', 'Repayment'],
    ['REPAYP', 'Repayment'],
    ['REPAYV', 'Repayment'],
    ['REPAYW', 'Repayment'],
  ])('should transform %s with a linked defendant account', (transactionType, title) => {
    const result = transformMajorCreditorTransactionDetails({
      details: {
        transactionType: { transactionType },
        defendantAccountNumber: '250000123M',
        defendantAccountId: '123123',
      },
    });

    expect(result).toEqual(
      details(part(fragment(title)), part(fragment('250000123M', { type: 'account', emit: '123123' }))),
    );
  });

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

  it('should keep an undocumented transaction code visible', () => {
    const result = transformMajorCreditorTransactionDetails({
      details: { transactionType: { transactionType: 'UNMAPPED' } },
    });

    expect(result).toEqual(details(part(fragment('UNMAPPED'))));
  });
});
