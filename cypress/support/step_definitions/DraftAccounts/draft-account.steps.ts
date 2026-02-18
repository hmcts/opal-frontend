/**
 * @file draftAccount.steps.ts
 * @description
 * Step definitions for creating draft accounts, setting their status, and interacting with draft listings
 * (Create & Manage + Check & Validate).
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
import {
  assertLatestDraftUpdateHasStrongEtag,
  assertStaleIfMatchConflict,
  createDraftAndSetStatus,
  simulateStaleIfMatchConflict,
  updateLastCreatedDraftAccountStatus,
} from '../../../e2e/functional/opal/actions/draft-account/draft-account.api';
import {
  CreateManageDraftsActions,
  CreateManageTab,
} from '../../../e2e/functional/opal/actions/draft-account/create-manage-drafts.actions';
import { DraftTabsActions, InputterTab, CheckerTab } from '../../../e2e/functional/opal/actions/draft-tabs.actions';
import {
  CheckAndValidateDraftsActions,
  CheckAndValidateTab,
} from '../../../e2e/functional/opal/actions/draft-account/check-and-validate-drafts.actions';
import { CheckAndValidateReviewActions } from '../../../e2e/functional/opal/actions/draft-account/check-and-validate-review.actions';
import { DraftAccountsInterceptActions } from '../../../e2e/functional/opal/actions/draft-account/draft-accounts.intercepts';
import { DraftAccountsTableColumn } from '../../../e2e/functional/opal/actions/draft-account/draft-accounts-common.actions';
import { DraftPayloadType } from '../../../support/utils/payloads';
import { log } from '../../utils/log.helper';
import { DraftAccountsFlow } from '../../../e2e/functional/opal/flows/draft-accounts.flow';
import { applyUniqPlaceholder } from '../../utils/stringUtils';

type AccountType = DraftPayloadType;
const inputter = () => new CreateManageDraftsActions();
const checker = () => new CheckAndValidateDraftsActions();
const checkerReview = () => new CheckAndValidateReviewActions();
const intercepts = () => new DraftAccountsInterceptActions();
const draftsFlow = () => new DraftAccountsFlow();
const tabs = () => new DraftTabsActions();
const withUniq = (value: string) => applyUniqPlaceholder(value ?? '');

/**
 * Unified implementation used by all step aliases.
 *
 * @param accountType - Draft payload type (e.g., company, pgToPay).
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
  const tableWithUniq = applyUniqToDataTable(table);
  const details = tableWithUniq.hashes?.() ?? [];

  log('step', `Creating ${accountType} draft → ${status}`, {
    accountType,
    status,
    fields: details,
    rowCount: details.length,
  });

  return createDraftAndSetStatus(accountType, status, tableWithUniq);
}

/**
 * Extracts an `account_status` override and returns the remaining table rows.
 * @param table Source DataTable that may include an Account_status row.
 * @returns The parsed status and a filtered DataTable without the status row.
 */
function extractStatusAndTable(table: DataTable): { status: string; filteredTable: DataTable } {
  const rawWithUniq = table.raw().map(([key, value]) => [key, applyUniqPlaceholder(value ?? '')]);
  const statusRowIndex = rawWithUniq.findIndex(([key]) => key?.trim().toLowerCase() === 'account_status');
  const status = statusRowIndex >= 0 ? (rawWithUniq[statusRowIndex][1] ?? '').trim() : 'Publishing Pending';
  const filteredRows = statusRowIndex >= 0 ? rawWithUniq.filter((_, index) => index !== statusRowIndex) : rawWithUniq;

  const filteredTable: DataTable = buildDataTable(filteredRows);

  return { status: status || 'Publishing Pending', filteredTable };
}

/**
 * Applies `{uniq}` replacement to all values in a DataTable.
 * @param table - Source DataTable to clone.
 * @returns New DataTable with `{uniq}` tokens expanded.
 */
function applyUniqToDataTable(table: DataTable): DataTable {
  const rowsWithUniq = table.raw().map(([key, value]) => [key, applyUniqPlaceholder(value ?? '')]);
  return buildDataTable(rowsWithUniq);
}

/**
 * Builds a Cucumber DataTable-like object from raw rows.
 * @param rawRows - 2D array of key/value rows.
 * @returns New DataTable instance backed by the provided rows.
 */
function buildDataTable(rawRows: string[][]): DataTable {
  const filteredRows = rawRows;

  const filteredTable: DataTable = {
    raw: () => filteredRows,
    rows: () => filteredRows,
    rowsHash: () =>
      Object.fromEntries(filteredRows.filter(([key]) => Boolean(key)).map(([key, value]) => [key, value ?? ''])),
    hashes: () => filteredRows.filter(([key]) => Boolean(key)).map(([key, value]) => ({ [key]: value ?? '' })),
    transpose: () => filteredTable,
    toString: () => JSON.stringify(filteredRows),
  } as DataTable;

  return filteredTable;
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
    const data = table.rows();
    log('step', `Create ${accountType} draft, status ${status}`, { accountType, status, data });
    return createDraftAndPrepareForPublishing(accountType, table, status);
  },
);

/**
 * @step Create a draft account from a table that includes Account_status.
 * @description Extracts Account_status for the status update and applies the remaining rows as payload overrides.
 *
 * @example
 *   Given a "adultOrYouthOnly" draft account exists with:
 *     | Account_status              | Submitted |
 *     | account.defendant.forenames | John      |
 *     | account.defendant.surname   | Smith     |
 */
Given('a {string} draft account exists with:', (accountType: AccountType, table: DataTable) => {
  const { status, filteredTable } = extractStatusAndTable(table);
  log('step', 'Create draft with table-provided status', { accountType, status });
  return createDraftAndPrepareForPublishing(accountType, filteredTable, status);
});

/**
 * @step Clears approved draft account listings to start from an empty state.
 * @description Stubs the approved drafts API to return zero results to avoid cross-test leakage.
 *
 * @example
 *   And I clear all approved accounts
 */
Given('I clear all approved accounts', () => {
  log('intercept', 'Clearing approved accounts');
  intercepts().clearApprovedListings();
});

/**
 * @step Open the Create and Manage Draft Accounts page.
 * @description Navigates from the dashboard to the inputter draft listings and asserts the header.
 * @example And I open Create and Manage Draft Accounts
 */
When('I open Create and Manage Draft Accounts', () => {
  log('navigate', 'Opening Create and Manage Draft Accounts');
  inputter().openPage();
});

/**
 * @step Click the Create account button on the Create and Manage Draft Accounts page.
 * @description Navigates from Create accounts to the Create new account or transfer in screen.
 */
When('I click the Create account button on Create and Manage Draft Accounts', () => {
  log('navigate', 'Clicking Create account button on Create and Manage Draft Accounts');
  inputter().clickCreateAccount();
});

/**
 * @step Use the back link on Create and Manage Draft Accounts.
 * @description Clicks the GOV.UK back link rendered on the draft listings page.
 * @example When I go back from Create and Manage Draft Accounts
 */
When('I go back to Create and Manage Draft Accounts', () => {
  log('navigate', 'Clicking back link on Create and Manage Draft Accounts');
  inputter().goBack();
});

/**
 * @step Use the back link on Check and Validate Draft Accounts.
 * @description Clicks the GOV.UK back link rendered on the checker draft pages.
 * @example When I go back to Check and Validate Draft Accounts
 */
When('I go back to Check and Validate Draft Accounts', () => {
  log('navigate', 'Clicking back link on Check and Validate Draft Accounts');
  checker().goBack();
});

/**
 * @step Update the most recently created draft account status.
 * @param status - Target status (e.g., "Deleted").
 * @example When I set the last created draft account status to "Deleted"
 */
When('I set the last created draft account status to {string}', (status: string) => {
  log('step', 'Setting last created draft status', { status });
  return updateLastCreatedDraftAccountStatus(status);
});

Then('the last draft update should return a new strong ETag', () => {
  log('assert', 'Asserting strong ETag for last draft update');
  return assertLatestDraftUpdateHasStrongEtag();
});

When('I attempt a stale If-Match update on the last draft account with status {string}', (status: string) => {
  log('step', 'Attempting stale If-Match update on last draft account', { status });
  return simulateStaleIfMatchConflict(status);
});

Then('the stale If-Match update should return a conflict', () => {
  log('assert', 'Asserting stale If-Match conflict');
  return assertStaleIfMatchConflict();
});

/**
 * @step Assert the status tag on a checker review page.
 * @param status - Expected status text (e.g., "In review").
 * @example Then the draft account status tag is "Rejected"
 */
Then('the draft account status tag is {string}', (status: string) => {
  log('assert', 'Asserting draft status tag', { status });
  checkerReview().assertStatusTag(status);
});

/**
 * @step Assert the checker tab heading text.
 * @param heading - Expected heading such as "To review" or "Deleted".
 * @example Then the checker status heading is "Deleted"
 */
Then('the checker status heading is {string}', (heading: string) => {
  log('assert', 'Asserting checker status heading', { heading });
  checker().assertStatusHeading(heading);
});

/**
 * @step Switch tab on the Create and Manage Draft Accounts page.
 * @description Clicks the specified tab on the inputter view.
 * @param tab - Tab name (e.g., "In review", "Rejected").
 * @example When I view the "Rejected" tab on the Create and Manage Draft Accounts page
 */
When('I view the {string} tab on the Create and Manage Draft Accounts page', (tab: CreateManageTab) => {
  log('navigate', 'Switching Create and Manage tab', { tab });
  inputter().switchTab(tab);
});

/**
 * @step Switch tab on the Check and Validate page.
 * @description Clicks the specified tab on the checker view.
 * @param tab - Tab name (e.g., "To review", "Rejected").
 * @example When I view the "To review" tab on the Check and Validate page
 */
When('I view the {string} tab on the Check and Validate page', (tab: CheckAndValidateTab) => {
  log('navigate', 'Switching Check and Validate tab', { tab });
  checker().switchTab(tab);
});

/**
 * @step Assert a checker tab is active.
 * @description Verifies the specified Check and Validate tab has `aria-current="page"`.
 * @param tab - Tab name (e.g., "Failed", "To review").
 * @example Then the "Failed" tab on Check and Validate is active
 */
Then('the {string} tab on Check and Validate is active', (tab: CheckAndValidateTab) => {
  log('assert', 'Asserting Check and Validate tab is active', { tab });
  checker().assertTabActive(tab);
});

/**
 * @step Open the Check and Validate Draft Accounts page
 * @description Composite to navigate to the checker view and confirm the "Review accounts" header is visible.
 * @example When I open Check and Validate Draft Accounts
 */
When('I open Check and Validate Draft Accounts', () => {
  log('navigate', 'Opening Check and Validate Draft Accounts with header assert');
  draftsFlow().openCheckAndValidateWithHeader();
});

/**
 * @step Assert account type column text.
 * @description Verifies the draft listings table Account type column contains the expected text.
 * @param expected - Account type text to find.
 * @example Then I see "Fixed Penalty" in the account type column on the draft table
 */
Then('I see {string} in the account type column on the draft table', (expected: string) => {
  const normalized = withUniq(expected);
  log('assert', 'Checking account type column contains expected text', { expected: normalized });
  checker().assertAccountType(normalized);
});

/**
 * @step Sort the draft accounts table by the given column and direction.
 * @description Ensures the sortable header is set to ascending/descending before asserting rows.
 * @param column - Display column name to sort by.
 * @param direction - "ascending" or "descending".
 * @example And I sort the draft accounts table by column "Date failed" in "descending" order
 */
When(
  'I sort the draft accounts table by column {string} in {string} order',
  (column: DraftAccountsTableColumn, direction: 'ascending' | 'descending') => {
    const normalizedDirection = direction.trim().toLowerCase() as 'ascending' | 'descending';
    const allowed: Array<'ascending' | 'descending'> = ['ascending', 'descending'];
    if (!allowed.includes(normalizedDirection)) {
      throw new Error(`Unsupported sort direction: ${direction}`);
    }
    log('action', 'Sorting draft accounts table', { column, direction: normalizedDirection });
    checker().sortByColumn(column, normalizedDirection);
  },
);

/**
 * @step Open a draft account by defendant/company name.
 * @param defendantName - Visible name in the Defendant column.
 */
When('I open the draft account for defendant {string}', (defendantName: string) => {
  const name = withUniq(defendantName);
  log('navigate', 'Opening draft account by defendant', { defendantName: name });
  inputter().openDefendant(name);
});

/**
 * @step Open a draft account in checker view by defendant/company name.
 * @param defendantName - Visible name in the Defendant column.
 * @example And I view the draft account details for defendant "GREEN, Oliver"
 */
When('I view the draft account details for defendant {string}', (defendantName: string) => {
  const name = withUniq(defendantName);
  log('navigate', 'Opening checker draft account by defendant', { defendantName: name });
  checker().openDefendant(name);
});

/**
 * @step Open a draft account by account number (Approved tab).
 * @param accountNumber - Visible account number in the Account column.
 */
When('I open the draft account number {string}', (accountNumber: string) => {
  log('navigate', 'Opening draft account by account number', { accountNumber });
  inputter().openAccountNumber(accountNumber);
});

/**
 * @step Follow the View all rejected accounts link.
 */
When('I view all rejected draft accounts', () => {
  log('navigate', 'Opening View all rejected accounts');
  inputter().openViewAllRejected();
});

/**
 * @step Use the back link to return from the View all rejected accounts page.
 */
When('I return to the rejected accounts tab', () => {
  log('navigate', 'Returning to rejected accounts tab');
  inputter().returnFromViewAllRejected();
});

/**
 * @step Open a draft account in checker view and assert the header.
 * @param defendantName - Defendant/company to click.
 * @param expectedHeader - Header text expected after navigation.
 */
Then(
  'I open the draft account for {string} and see header {string}',
  (defendantName: string, expectedHeader: string) => {
    const name = withUniq(defendantName);
    const header = withUniq(expectedHeader);
    log('navigate', 'Opening draft and asserting header', { defendantName: name, expectedHeader: header });
    draftsFlow().openDraftAndAssertHeader(name, header);
  },
);

/**
 * @step Assert the draft review page header and status tag after navigation.
 * @param header - Expected page header text.
 * @param status - Expected status tag (e.g., "In review").
 */
Then('I should be back on the page {string} with status {string}', (header: string, status: string) => {
  const normalizedHeader = withUniq(header);
  log('assert', 'Asserting draft review header and status tag', { header: normalizedHeader, status });
  draftsFlow().assertReviewHeaderAndStatus(normalizedHeader, status);
});

/**
 * @step Assert the checker header and status heading together.
 * @param header - Expected page header text.
 * @param statusHeading - Expected status heading (e.g., "To review").
 */
Then(
  'I should see the checker header {string} and status heading {string}',
  (header: string, statusHeading: string) => {
    const normalizedHeader = withUniq(header);
    log('assert', 'Asserting checker header and status heading', {
      header: normalizedHeader,
      statusHeading,
    });
    draftsFlow().assertHeaderAndStatusHeading(normalizedHeader, statusHeading);
  },
);

/**
 * @step Assert sortable table headings.
 * @param table - Single-column table of heading labels in order.
 */
Then('the manual draft table headings are:', (table: DataTable) => {
  const headings = table
    .rows()
    .map(([heading]) => withUniq(heading.trim()))
    .filter(Boolean);
  log('assert', 'Draft table headings', { headingsList: headings });
  checker().assertHeadings(headings);
});

/**
 * @step Assert a row contains expected values in order.
 * @param position - 1-based row index.
 * @param table - Single-column table of expected cell text.
 */
Then('the manual draft table row {int} contains:', (position: number, table: DataTable) => {
  const expectedValues = table
    .rows()
    .map(([value]) => withUniq(value.trim()))
    .filter(Boolean);
  log('assert', 'Draft table row values', { position, expectedValues });
  inputter().assertRowValues(position, expectedValues);
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
      .map(([column, value]) => [column.trim(), withUniq(value.trim())])
      .filter(([column]) => Boolean(column)),
  );
  log('assert', 'Draft table row column values', { position, expectations });
  inputter().assertRowColumns(position, expectations as any);
});

/**
 * @step Assert that the row matching a column value has the provided column/value pairs.
 * @param matchValue - Text to find within the matchColumn.
 * @param matchColumn - Column used to locate the row (e.g., "Defendant").
 * @param table - Two-column table: Column | Value.
 */
Then(
  'the manual draft table row containing {string} in column {string} has values:',
  (matchValue: string, matchColumn: DraftAccountsTableColumn, table: DataTable) => {
    const expectations = Object.fromEntries(
      table
        .rows()
        .map(([column, value]) => [column.trim(), withUniq(value.trim())])
        .filter(([column]) => Boolean(column)),
    );
    const normalizedMatch = withUniq(matchValue);
    log('assert', 'Draft table row values by match', { matchColumn, matchValue: normalizedMatch, expectations });
    checker().assertRowByMatch(matchColumn, normalizedMatch, expectations as any);
  },
);

/**
 * @step Assert that a column contains the provided text.
 * @param column - Column label (e.g., "Defendant", "Account type").
 * @param expectedText - Text to search for within the column cells.
 */
Then('I see {string} in the manual draft column {string}', (expectedText: string, column: string) => {
  const normalized = withUniq(expectedText);
  log('assert', 'Draft table column contains text', { column, expectedText: normalized });
  inputter().assertColumnContains(
    column as Parameters<CreateManageDraftsActions['assertColumnContains']>[0],
    normalized,
  );
});

/**
 * @step Assert that the draft accounts table contains text in a column (checker view).
 * @param expectedText - Text to search for.
 * @param column - Column label.
 */
Then('the draft accounts table should contain {string} in column {string}', (expectedText: string, column: string) => {
  const normalized = withUniq(expectedText);
  log('assert', 'Checker draft table column contains text', { column, expectedText: normalized });
  checker().assertColumnContains(column as DraftAccountsTableColumn, normalized);
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
    // Refresh to force a fresh API fetch and table render before matching; avoids stale/paginated views.
    cy.reload();
    const normalized = withUniq(expectedText);
    log('navigate', 'Opening draft account by column match', { column, expectedText: normalized });
    cy.log(`Matching draft row → column: ${column}, expected: ${normalized}`);
    inputter().openFirstMatchInColumn(
      column as Parameters<CreateManageDraftsActions['openFirstMatchInColumn']>[0],
      normalized,
    );
  },
);

/**
 * @step Switches to the specified inputter draft tab.
 * @description Clicks the tab by name within the inputter draft accounts view.
 * @param tab - Tab name (e.g., "In review").
 */
When('I view the inputter draft tab {string}', (tab: InputterTab) => {
  log('navigate', 'Switching inputter tab', { tab });
  tabs().switchInputterTab(tab);
});

/**
 * @step Switches to the specified checker draft tab.
 * @description Clicks the tab by name within the checker draft accounts view.
 * @param tab - Tab name (e.g., "To review").
 */
When('I view the checker draft tab {string}', (tab: CheckerTab) => {
  log('navigate', 'Switching checker tab', { tab });
  tabs().switchCheckerTab(tab);
});
