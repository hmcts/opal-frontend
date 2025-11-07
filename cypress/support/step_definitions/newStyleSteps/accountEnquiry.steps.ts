// cypress/support/step_definitions/newStyleSteps/accountEnquiry.steps.ts
import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { AccountEnquiryFlow } from '../../../e2e/functional/opal/flows/accountEnquiry.flow';
import { AccountDetailsActions } from '../../../e2e/functional/opal/actions/account.details.actions';
import { AccountSearchActions } from '../../../e2e/functional/opal/actions/account.search.actions';

const flow = () => new AccountEnquiryFlow();

// Direct actions for the two “not flows” steps
const details = () => new AccountDetailsActions();
const search = () => new AccountSearchActions();

/* ---------- Test data setup ---------- */

Given('any approved draft accounts are cleared', () => {
  cy.task('clearApprovedDrafts');
});

Given('a {string} account exists and is published with:', (type: string, table: DataTable) => {
  const data = table.rowsHash();
  cy.task('createAndPublishAccount', { type, ...data });
});

/* ---------- Search / open ---------- */

When('I search for the account by last name {string}', (surname: string) => {
  flow().searchAndClickLatestBySurname(surname);
});

When('I search for the account by last name {string} and open the latest result', (surname: string) => {
  flow().searchAndClickLatestBySurname(surname);
});

/* ---------- “Not flows!” steps (use actions directly) ---------- */

When('I open the most recent published account', () => {
  search().openLatestPublished();
});

Then('I should see the page header contains {string}', (text: string) => {
  details().assertHeaderContains(text);
});

/* ---------- Keep this one as a flow (uses cross-page helper & routing checks) ---------- */

When('I click the latest published account link', () => {
  flow().clickLatestPublishedFromResultsOrAcrossPages();
});

/* ---------- Defendant details: navigate & assert ---------- */

When('I go to the Defendant details section and the header is {string}', (expected: string) => {
  flow().goToDefendantDetailsAndAssert(expected);
});

/* ---------- Edit + Route Guard flows ---------- */

When('I edit the Defendant details and change the First name to {string}', (value: string) => {
  flow().editDefendantAndChangeFirstName(value);
});

When('I attempt to cancel editing and choose "Cancel" on the confirmation dialog', () => {
  flow().cancelEditAndStay();
});

Then('I should see the First name field still contains {string}', (expected: string) => {
  details().assertFirstNameValue(expected);
});

When('I attempt to cancel editing and choose "OK" on the confirmation dialog', () => {
  flow().cancelEditAndLeave();
});

Then('I should see the account header contains {string}', (expected: string) => {
  details().assertHeaderContains(expected);
});

Then('I should remain on the edit page', () => {
  details().assertStillOnEditPage();
});

Then('I should return to the account details page', () => {
  details().assertReturnedToAccountDetails();
});
