/**
 * @file manual-account-creation.review-account.steps.ts
 * @description Step definitions for the Manual Account Creation **Check account details** page.
 */
import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualReviewAccountActions } from '../../../../e2e/functional/opal/actions/manual-account-creation/review-account.actions';
import { ManualAccountCreationFlow } from '../../../../e2e/functional/opal/flows/manual-account-creation.flow';
import { normalizeTableRows } from '../../../utils/cucumberHelpers';
import { log } from '../../../utils/log.helper';

type SummaryRow = { label: string; value: string };

const reviewAccount = (): ManualReviewAccountActions => new ManualReviewAccountActions();
const macFlow = (): ManualAccountCreationFlow => new ManualAccountCreationFlow();

const mapTableToSummaryRows = (table: DataTable): SummaryRow[] => {
  const rows = normalizeTableRows(table);
  return rows
    .filter((row) => row.length >= 2)
    .map(([label, value]) => ({ label: label.trim(), value: (value ?? '').trim() }))
    .filter(({ label }) => !!label && !/^field$/i.test(label));
};

const resolveSummaryListId = (section: string): string => {
  const normalized = section.toLowerCase();
  if (normalized.includes('court details')) return 'courtDetails';
  if (normalized.includes('company details')) return 'companyDetails';
  if (normalized.includes('parent or guardian')) return 'parentGuardianDetails';
  if (normalized.includes('defendant details') || normalized.includes('personal details')) return 'personalDetails';
  if (normalized.includes('employer details')) return 'employerDetails';
  throw new Error(`Unsupported review summary section: ${section}`);
};

/**
 * Navigates from Account details to Check account details.
 */
When('I check the manual account details', () => {
  log('step', 'Checking account details from task list');
  macFlow().checkManualAccountDetails();
});

/**
 * Asserts a review summary card using a DataTable.
 */
Then('I see the manual review {string} summary:', (section: string, table: DataTable) => {
  const summaryListId = resolveSummaryListId(section);
  const rows = mapTableToSummaryRows(table);
  log('assert', 'Asserting review summary', { section, summaryListId, rows });
  reviewAccount().assertSummaryList(summaryListId, rows);
});

/**
 * Asserts the offences and impositions table on the review page.
 */
Then('the manual review offence table contains:', (table: DataTable) => {
  const rows = normalizeTableRows(table)
    .filter((row, index) => !(index === 0 && row[0].toLowerCase() === 'imposition'))
    .map(([imposition, creditor, amountImposed, amountPaid, balanceRemaining]) => ({
      imposition: imposition.trim(),
      creditor: (creditor ?? '').trim(),
      amountImposed: (amountImposed ?? '').trim(),
      amountPaid: (amountPaid ?? '').trim(),
      balanceRemaining: (balanceRemaining ?? '').trim(),
    }));

  log('assert', 'Asserting offences and impositions table', { rows });
  reviewAccount().assertOffenceTable(rows);
});

/**
 * Asserts the minor creditor summary list beneath an imposition.
 */
Then('the manual review minor creditor details are:', (table: DataTable) => {
  const rows = mapTableToSummaryRows(table);
  log('assert', 'Asserting minor creditor summary', { rows });
  reviewAccount().assertMinorCreditorDetails(rows);
});

/**
 * Submits the account from the review page.
 */
When('I submit the manual account for review', () => {
  log('navigate', 'Submitting manual account for review');
  reviewAccount().submitForReview();
});
