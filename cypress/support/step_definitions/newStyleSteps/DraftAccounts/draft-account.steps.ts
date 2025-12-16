/**
 * @file draftAccount.steps.ts
 * @description
 * Step definitions for creating draft accounts, setting their status, and interacting with draft listings.
 * Supports multiple Gherkin aliases that map to one underlying implementation,
 * keeping features readable while avoiding duplicate logic.
 *
 * @remarks
 * - These steps operate at the API level via Cypress tasks — no UI overhead.
 * - Listing steps drive the Create and Manage Draft Accounts UI.
 * - Use them in Background or setup stages to prepare predictable data states.
 * - Aliases allow both the explicit and implicit “Publishing Pending” forms.
 *
 * @example
 *   Given I create a "company" draft account with the following details and set status "Submitted":
 *     | account.defendant.company_name | Example Co Ltd |
 *     | account.account_type           | Fine           |
 *
 * @example
 *   And I create and publish an "adultOrYouthOnly" draft account with the following details:
 *     | account.defendant.forenames | John |
 *     | account.defendant.surname   | Smith |
 */

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { createDraftAndSetStatus } from '../../../../e2e/functional/opal/actions/draft-account/draft-account.api';
import { CreateManageDraftsActions } from '../../../../e2e/functional/opal/actions/draft-account/create-manage-drafts.actions';
import { log } from '../../../utils/log.helper';

/**
 * @typedef AccountType
 * Union of all supported draft account types (including fixed penalty variants).
 */
type AccountType = 'company' | 'adultOrYouthOnly' | 'pgToPay' | 'fixedPenalty' | 'fixedPenaltyCompany';

const list = () => new CreateManageDraftsActions();

/**
 * Unified implementation used by all step aliases.
 *
 * @param accountType - The type of account to create (`company`, `adultOrYouthOnly`, or `pgToPay`).
 * @param table - A Cucumber DataTable defining the account fields and values.
 * @param status - The target status after creation (defaults to "Publishing Pending").
 *
 * @returns Cypress.Chainable
 *
 * @remarks
 * - Writes Cypress logs for clear traceability in the test runner.
 * - Default behaviour simulates the “create and publish pending” lifecycle.
 */
function createDraftAndPrepareForPublishing(
  accountType: AccountType,
  table: DataTable,
  status: string = 'Publishing Pending',
) {
  const details = table.hashes?.() ?? [];

  log('step', `Creating ${accountType} draft → ${status}`, {
    accountType,
    status,
    fields: details,
    rowCount: details.length,
  });

  return createDraftAndSetStatus(accountType, status, table);
}

/**
 * @step Create a draft account, set explicit status, and persist.
 * @description
 *  Creates a draft account of the specified type, populates it with data from the
 *  provided Cucumber DataTable, and sets the draft's status before saving.
 *
 * @param accountType - The account type (e.g., "company" or "individual").
 * @param status - The target draft status to assign.
 * @param table - Cucumber DataTable containing field/value pairs for the draft account.
 *
 * @remarks
 *  - Uses the flow `createDraftAndPrepareForPublishing()` to perform all actions.
 *  - Utilizes `table.rows()` to safely extract the table data for logging.
 *
 * @example
 *  Given I create a "company" draft account with the following details and set status "Submitted":
 *    | account.defendant.company_name | Example Co |
 */
Given(
  'I create a {string} draft account with the following details and set status {string}:',
  (accountType: AccountType, status: string, table: DataTable) => {
    // Convert DataTable into raw row format for logging purposes.
    const data = table.rows();

    log('step', `Create ${accountType} draft, status ${status}`, { accountType, status, data });

    // Perform the draft creation and set the desired status.
    return createDraftAndPrepareForPublishing(accountType, table, status);
  },
);

/**
 * @step Open a draft account by defendant/company name.
 * @param defendantName - Visible name in the Defendant column.
 */
When('I open the draft account for defendant {string}', (defendantName: string) => {
  log('navigate', 'Opening draft account by defendant', { defendantName });
  list().openDefendant(defendantName);
});

/**
 * @step Open a draft account by account number (Approved tab).
 * @param accountNumber - Visible account number in the Account column.
 */
When('I open the draft account number {string}', (accountNumber: string) => {
  log('navigate', 'Opening draft account by account number', { accountNumber });
  list().openAccountNumber(accountNumber);
});

/**
 * @step Follow the View all rejected accounts link.
 */
When('I view all rejected draft accounts', () => {
  log('navigate', 'Opening View all rejected accounts');
  list().openViewAllRejected();
});

/**
 * @step Use the back link to return from the View all rejected accounts page.
 */
When('I return to the rejected accounts tab', () => {
  log('navigate', 'Returning to rejected accounts tab');
  list().returnFromViewAllRejected();
});

/**
 * @step Assert sortable table headings.
 * @param table - Single-column table of heading labels in order.
 */
Then('the manual draft table headings are:', (table: DataTable) => {
  const headings = table
    .rows()
    .map(([heading]) => heading.trim())
    .filter(Boolean);
  log('assert', 'Draft table headings', { headings });
  list().assertHeadings(headings);
});

/**
 * @step Assert a row contains expected values in order.
 * @param position - 1-based row index.
 * @param table - Single-column table of expected cell text.
 */
Then('the manual draft table row {int} contains:', (position: number, table: DataTable) => {
  const expectedValues = table
    .rows()
    .map(([value]) => value.trim())
    .filter(Boolean);
  log('assert', 'Draft table row values', { position, expectedValues });
  list().assertRowValues(position, expectedValues);
});

/**
 * @step Assert a row contains specific column/value pairs (unordered).
 * @param position - 1-based row index.
 * @param table - Two-column table: Column | Value.
 */
Then('the manual draft table row {int} has values:', (position: number, table: DataTable) => {
  const expectations = Object.fromEntries(
    table
      .rows()
      .map(([column, value]) => [column.trim(), value.trim()])
      .filter(([column]) => Boolean(column)),
  );
  log('assert', 'Draft table row column values', { position, expectations });
  list().assertRowColumns(position, expectations as any);
});

/**
 * @step Assert that a column contains the provided text.
 * @param column - Column label (e.g., "Defendant", "Account type").
 * @param expectedText - Text to search for within the column cells.
 */
Then('I see {string} in the manual draft column {string}', (expectedText: string, column: string) => {
  log('assert', 'Draft table column contains text', { column, expectedText });
  list().assertColumnContains(
    column as Parameters<CreateManageDraftsActions['assertColumnContains']>[0],
    expectedText,
  );
});

/**
 * @step Open a draft account based on a matching cell value.
 * @description Finds the first row where the specified column contains the provided text and opens that draft account.
 * @param expectedText - Text to match within the target column.
 * @param column - Column label to search (e.g., "Defendant", "Account type").
 */
When(
  'I open the draft account in row containing {string} in the manual draft column {string}',
  (expectedText: string, column: string) => {
    log('navigate', 'Opening draft account by column match', { column, expectedText });
    list().openFirstMatchInColumn(
      column as Parameters<CreateManageDraftsActions['openFirstMatchInColumn']>[0],
      expectedText,
    );
  },
);
