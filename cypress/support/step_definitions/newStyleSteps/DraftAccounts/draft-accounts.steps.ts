/**
 * @file draft-accounts.steps.ts
 * @description
 * NewStyle step definitions for interacting with the Create and Manage Draft
 * Accounts listings and the View all rejected accounts page.
 */
import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { CreateManageDraftsActions } from '../../../../e2e/functional/opal/actions/create-manage-drafts.actions';
import { log } from '../../../utils/log.helper';

const list = () => new CreateManageDraftsActions();

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
  list().assertColumnContains(column as Parameters<CreateManageDraftsActions['assertColumnContains']>[0], expectedText);
});

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
