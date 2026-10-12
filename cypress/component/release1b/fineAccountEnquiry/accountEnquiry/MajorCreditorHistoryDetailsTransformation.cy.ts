import { transformMajorCreditorTransactionDetails } from 'src/app/flows/fines/fines-acc/services/utils/fines-acc-payload-transform-major-creditor-history-and-notes.utils';

const ACCOUNT_ENQUIRY_JIRA_LABEL = '@JIRA-LABEL:account-enquiry';
const MAJOR_CREDITOR_HISTORY_STORY_TAG = '@JIRA-STORY:PO-2657';
const MAJOR_CREDITOR_HISTORY_EPIC_TAG = '@JIRA-EPIC:PO-2655';

const buildTags = (...tags: string[]): string[] => [...tags, ACCOUNT_ENQUIRY_JIRA_LABEL, '@R1B'];

const fragment = (text: string, link?: { type: string; emit: string }) => ({
  text,
  bold: false,
  hyphen: false,
  ...(link ? { link } : {}),
});

const part = (...fragments: ReturnType<typeof fragment>[]) => ({ fragments });

const details = (...line1: ReturnType<typeof part>[]) => ({ line1, line2: null });

const FIXED_LABEL_TRANSACTION_TEMPLATES = [
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
] as const;

describe('Major Creditor Account Enquiry - History details transformation', () => {
  it(
    'AC1a. Transformation service - converts raw major creditor financial history item data into structured Details JSON',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      const result = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'BACS' },
          paymentReference: 'MJS0000001',
        },
      });

      cy.wrap(result).should(
        'deep.equal',
        details(part(fragment('BACS payment')), part(fragment('Payment reference:'), fragment('MJS0000001'))),
      );
    },
  );

  it(
    'AC1b. Structured JSON model - produces line1 Part[] and fragments with default bold and hyphen flags',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      const result = transformMajorCreditorTransactionDetails({
        details: {
          transaction_type: { transaction_type: 'PAYMNT' },
          defendant_account_number: '250000123M',
          defendant_account_id: '123123',
        },
      });

      cy.wrap(result).should(
        'deep.equal',
        details(part(fragment('Payment received')), part(fragment('250000123M', { type: 'account', emit: '123123' }))),
      );
    },
  );

  it(
    'AC1c. Optional line2 - sets line2 to null when there is no secondary line',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      const result = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'CANCHQ' },
          paymentReference: '5429',
        },
      });

      cy.wrap(result).its('line2').should('eq', null);
      cy.wrap(result.line1).should('deep.equal', [
        part(fragment('Cheque cancelled')),
        part(fragment('Cheque number:'), fragment('5429')),
      ]);
    },
  );

  it(
    'AC1d. Segment rules - represents each logical template segment as a separate Details part',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      const result = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'CHEQUE' },
          paymentReference: '524589',
          status: { creditorTransactionStatus: 'X' },
          statusDate: '2026-06-20T09:00:00',
        },
      });

      cy.wrap(result).should(
        'deep.equal',
        details(
          part(fragment('Cheque issued')),
          part(fragment('Cheque number:'), fragment('524589')),
          part(fragment('Cheque cancelled 20/06/2026')),
        ),
      );
    },
  );

  it(
    'AC1e. Template alignment - applies the BACS template without corrupting nested special characters in the API response',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      const paymentReference = 'MJS<{value}>|[optional] - "quoted" & apostrophe\'s';
      const result = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'RTBACS' },
          paymentReference,
        },
      });

      cy.wrap(result).should(
        'deep.equal',
        details(
          part(fragment('BACS payment returned')),
          part(fragment('Payment reference:'), fragment(paymentReference)),
        ),
      );
    },
  );

  it(
    'AC1e. Template alignment - applies every documented fixed-label transaction template',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      FIXED_LABEL_TRANSACTION_TEMPLATES.forEach(([transactionType, label]) => {
        const result = transformMajorCreditorTransactionDetails({
          details: { transactionType: { transactionType } },
        });

        cy.wrap(result, { log: false }).should('deep.equal', details(part(fragment(label))));
      });
    },
  );

  it(
    'AC1e. Template alignment - applies repayment and suspense-transfer templates with their documented linked value',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      [
        ['MADJ', 'Manual adjustment'],
        ['PAYMNT', 'Payment received'],
        ['REPAYC', 'Repayment'],
        ['REPAYF', 'Repayment'],
        ['REPAYM', 'Repayment'],
        ['REPAYP', 'Repayment'],
        ['REPAYV', 'Repayment'],
        ['REPAYW', 'Repayment'],
      ].forEach(([transactionType, label]) => {
        const result = transformMajorCreditorTransactionDetails({
          details: {
            transactionType: { transactionType },
            defendantAccountNumber: '250000123M',
            defendantAccountId: '123123',
          },
        });

        cy.wrap(result, { log: false }).should(
          'deep.equal',
          details(part(fragment(label)), part(fragment('250000123M', { type: 'account', emit: '123123' }))),
        );
      });

      const repaymentFromSuspense = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'REPSUS' },
          associatedRecordId: '256335',
        },
      });
      const suspenseTransfer = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'XFER' },
          associatedRecordType: 'suspense_item',
          associatedRecordId: '256335',
        },
      });

      cy.wrap(repaymentFromSuspense, { log: false }).should(
        'deep.equal',
        details(
          part(fragment('Repayment from suspense')),
          part(fragment('256335', { type: 'suspenseTransaction', emit: '256335' })),
        ),
      );
      cy.wrap(suspenseTransfer, { log: false }).should(
        'deep.equal',
        details(
          part(fragment('Suspense transfer')),
          part(fragment('256335', { type: 'suspenseTransaction', emit: '256335' })),
        ),
      );

      const defendantAccountSuspenseTransfer = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'XFER' },
          associatedRecordType: 'defendant_transaction',
          defendantAccountNumber: '250000123M',
          defendantAccountId: '123123',
        },
      });
      const creditorAccountSuspenseTransfer = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'XFER' },
          associatedRecordType: 'creditor_accounts',
          accountNumber: '99000000000850',
          associatedRecordId: '850',
        },
      });

      cy.wrap(defendantAccountSuspenseTransfer, { log: false }).should(
        'deep.equal',
        details(part(fragment('Suspense transfer')), part(fragment('250000123M', { type: 'account', emit: '123123' }))),
      );
      cy.wrap(creditorAccountSuspenseTransfer, { log: false }).should(
        'deep.equal',
        details(
          part(fragment('Suspense transfer')),
          part(fragment('99000000000850', { type: 'account', emit: '850' })),
        ),
      );
    },
  );

  it(
    'AC1e. Template alignment - applies the reissued BACS and cheque templates with their optional values',
    { tags: buildTags(MAJOR_CREDITOR_HISTORY_STORY_TAG, MAJOR_CREDITOR_HISTORY_EPIC_TAG) },
    () => {
      const reissuedBacs = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'RIBACS' },
          paymentReference: '10000291',
        },
      });
      const reissuedCheque = transformMajorCreditorTransactionDetails({
        details: {
          transactionType: { transactionType: 'RICHEQ' },
          paymentReference: '524589',
          status: { creditorTransactionStatus: 'D' },
          statusDate: '2025-11-10T09:00:00',
        },
      });

      cy.wrap(reissuedBacs, { log: false }).should(
        'deep.equal',
        details(part(fragment('BACS payment reissued')), part(fragment('Payment reference:'), fragment('10000291'))),
      );
      cy.wrap(reissuedCheque, { log: false }).should(
        'deep.equal',
        details(
          part(fragment('Cheque reissued')),
          part(fragment('Cheque number:'), fragment('524589')),
          part(fragment('Cheque dishonoured 10/11/2025')),
        ),
      );
    },
  );
});
