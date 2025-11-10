/**
 * @file accountEnquiry.steps.ts
 * @description
 * Cucumber step definitions for **Account Enquiry** end-to-end flows.
 *
 * These steps integrate high-level flows (e.g., `AccountEnquiryFlow`)
 * with lower-level Actions (e.g., `AccountDetailsDefendantActions`),
 * providing natural-language mappings for Cucumber `.feature` files.
 *
 * @remarks
 * - The step definitions are intentionally **thin wrappers** that delegate logic
 *   to reusable flow/action classes.
 * - Each step mirrors the human-readable Gherkin phrasing while maintaining traceable logs.
 * - Tasks (e.g., `clearApprovedDrafts`, `createAndPublishAccount`) are run via Cypress plugins.
 */

import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { AccountEnquiryFlow } from '../../../e2e/functional/opal/flows/accountEnquiry.flow';
import { AccountDetailsDefendantActions } from '../../../e2e/functional/opal/actions/account details/details.defendant.actions';
import { AccountSearchIndividualsActions } from '../../../e2e/functional/opal/actions/search/search.individuals.actions';

// Factory functions so each step gets a fresh instance with its own Cypress chain
const flow = () => new AccountEnquiryFlow();
const details = () => new AccountDetailsDefendantActions();
const search = () => new AccountSearchIndividualsActions();

/**
 * @step Clears any approved draft accounts via a Cypress task.
 * Typically used in background or setup scenarios to ensure a clean state.
 */
Given('any approved draft accounts are cleared', () => {
  cy.task('clearApprovedDrafts');
});

/**
 * @step Creates and publishes an account of a given type using tabular data.
 *
 * @example
 *   Given a "company" account exists and is published with:
 *     | Name | Example Ltd |
 *     | Type | Company     |
 *
 * @param type - The account type (e.g., "company" or "individual")
 * @param table - DataTable containing field/value pairs for account creation
 */
Given('a {string} account exists and is published with:', (type: string, table: DataTable) => {
  const data = table.rowsHash();
  cy.task('createAndPublishAccount', { type, ...data });
});

/**
 * @step Selects the latest account and verifies the header.
 */
When('I select the latest published account and verify the header is "Mr John ACCDETAILSURNAME"', (header: string) => {
  flow().clickLatestPublishedFromResultsOrAcrossPages();
  details().assertHeaderContains(header);
});

/**
 * @step Searches for an account by last name using the AccountEnquiryFlow.
 */
When('I search for the account by last name {string}', (surname: string) => {
  flow().searchBySurname(surname);
});

/**
 * @step Explicit variant — performs the similar behaviour as above but actually
 * “opens the latest result”
 */
When('I search for the account by last name {string} and open the latest result', (surname: string) => {
  flow().searchAndClickLatestBySurnameOpenLatestResult(surname);
});

/**
 * @step Verifies the details page header contains specific text.
 *
 * @param text - Expected substring in the header.
 */
Then('I should see the page header contains {string}', (text: string) => {
  details().assertHeaderContains(text);
});

/**
 * @step Navigates to the Defendant details section and validates the header text.
 *
 * @param expected - Expected header text for the section.
 */
When('I go to the Defendant details section and the header is {string}', (expected: string) => {
  flow().goToDefendantDetailsAndAssert(expected);
});

/**
 * @step Edits the Defendant details, changing the First name to a given value.
 *
 * @param value - New First name to enter.
 */
When('I edit the Defendant details and change the First name to {string}', (value: string) => {
  flow().editDefendantAndChangeFirstName(value);
});

/**
 * @step Attempts to cancel editing and chooses “Cancel” on the confirmation dialog.
 * Expected result: remain on the edit page.
 */
When('I attempt to cancel editing and choose "Cancel" on the confirmation dialog', () => {
  flow().cancelEditAndStay();
});

/**
 * @step Verifies that the First name field still contains a given value after cancelling.
 *
 * @param expected - The expected First name value.
 */
Then('I should see the First name field still contains {string}', (expected: string) => {
  details().assertFirstNameValue(expected);
});

/**
 * @step Attempts to cancel editing and chooses “OK” (confirm leave).
 * Expected result: navigate back to the account details page.
 */
When('I attempt to cancel editing and choose "OK" on the confirmation dialog', () => {
  flow().cancelEditAndLeave();
});

/**
 * @step Validates that the account header contains the given string.
 *
 * @param expected - Expected header content (typically a name or company).
 */
Then('I should see the account header contains {string}', (expected: string) => {
  details().assertHeaderContains(expected);
});

/**
 * @step Ensures we remain on the edit page after cancelling (no navigation occurred).
 */
Then('I should remain on the edit page', () => {
  details().assertStillOnEditPage();
});

/**
 * @step Confirms the user has returned to the account details page.
 */
Then('I should return to the account details page', () => {
  details().assertReturnedToAccountDetails();
});

/**
 * @step Validates route-guard behaviour for company edits.
 * It temporarily edits the company name, cancels once, verifies persistence,
 * then cancels again to revert to the original.
 */
When('I verify route guard behaviour when cancelling company edits', () => {
  flow().verifyRouteGuardBehaviour('Accdetail comp', 'Test');
});

/**
 * @step Validates cancel-changes behaviour for company edits.
 * Edits the company name, cancels, and verifies no persisted changes.
 */
When('I verify cancel-changes behaviour for company edits', () => {
  flow().verifyCancelChangesBehaviour('Accdetail comp', 'Test');
});

/**
 * @step Opens a company account details page by company name.
 *
 * @param companyName - The visible company name to locate and open.
 */
When('I open the company account details for {string}', (companyName: string) => {
  flow().openCompanyAccountDetailsByName(companyName);
});
