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
});
