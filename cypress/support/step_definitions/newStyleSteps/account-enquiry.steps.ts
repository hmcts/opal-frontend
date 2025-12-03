/**
 * @file account-enquiry.steps.ts
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
import { AccountEnquiryFlow } from '../../../e2e/functional/opal/flows/account-enquiry.flow';
import { CommonFlow } from '../../../e2e/functional/opal/flows/common-flow';

// Actions
import { AccountDetailsDefendantActions } from '../../../e2e/functional/opal/actions/account-details/details.defendant.actions';
import { AccountDetailsAtAGlanceActions } from '../../../e2e/functional/opal/actions/account-details/details.at-a-glance.actions';
import { CommonActions } from '../../../e2e/functional/opal/actions/common/common.actions';
import { EditDefendantDetailsActions } from '../../../e2e/functional/opal/actions/account-details/edit.defendant-details.actions';
import { AccountDetailsNavActions } from '../../../e2e/functional/opal/actions/account-details/details.nav.actions';
import { EditParentGuardianDetailsActions } from '../../../e2e/functional/opal/actions/account-details/edit.parent-guardian-details.actions';
import { log } from '../../utils/log.helper';

// Factory functions so each step gets a fresh instance with its own Cypress chain
const flow = () => new AccountEnquiryFlow();
const commonFlow = () => new CommonFlow();
const atAGlanceDetails = () => new AccountDetailsAtAGlanceActions();
const common = () => new CommonActions();
const editDefendantDetails = () => new EditDefendantDetailsActions();
const editParentGuardianDetails = () => new EditParentGuardianDetailsActions();
const navActions = () => new AccountDetailsNavActions();

type CommentRow = { [key: string]: string };

import { rowsHashSafe } from '../../../support/utils/table';

/**
 * @step Clears any approved draft accounts via a Cypress task.
 * Typically used in background or setup scenarios to ensure a clean state.
 */
Given('any approved draft accounts are cleared', () => {
  log('step', 'Clearing approved draft accounts');
  cy.task('clearApprovedDrafts');
});

/**
 * @step Selects the latest account and verifies the header.
 */
When('I select the latest published account and verify the header is {string}', (header: string) => {
  log('step', 'Selecting latest published account', { expectedHeader: header });
  flow().clickLatestPublishedFromResultsOrAcrossPages();
  atAGlanceDetails().assertHeaderContains(header);
});

/**
 * @step Searches for an account by last name using the AccountEnquiryFlow.
 */
When('I search for the account by last name {string}', (surname: string) => {
  log('step', 'Searching by surname', { surname });
  flow().searchBySurname(surname);
});

/**
 * @step Search by surname and assert the At a glance header.
 * @example
 *  When I search for the account by last name "Smith" and verify the page header is "At a glance"
 */
When(
  'I search for the account by last name {string} and verify the page header is {string}',
  (surname: string, header: string) => {
    log('step', 'Search by surname and verify header', { surname, expectedHeader: header });

    flow().searchBySurname(surname);
    flow().clickLatestPublishedFromResultsOrAcrossPages();
    atAGlanceDetails().assertHeaderContains(header);
  },
);

/**
 * @step Explicit variant — performs the similar behaviour as above but actually
 * “opens the latest result”
 */
When('I search for the account by last name {string} and open the latest result', (surname: string) => {
  log('step', 'Search by surname and open latest result', { surname });
  flow().searchAndClickLatestBySurnameOpenLatestResult(surname);
});

/**
 * @step Verifies that any page/account/summary header contains the given string.
 *
 * @remarks
 * - Provides multiple natural-language aliases for the same assertion.
 * - Delegates to {@link AccountDetailsDefendantActions.assertHeaderContains}.
 *
 * @example
 *   Then I should see the page header contains "Comments"
 *   Then I should see the account header contains "Mr John ACCDETAILSURNAME"
 *   Then I should see the account summary header contains "Mr John ACCDETAILSURNAME"
 */
Then(/^I should see the (?:page|account(?: summary)?) header contains "([^"]+)"$/, (expected: string) => {
  log('assert', 'Asserting header contains', { expected });
  atAGlanceDetails().assertHeaderContains(expected);
});

/**
 * @step Navigates to the Defendant details section and validates the header text.
 *
 * @param expected - Expected header text for the section.
 */
When('I go to the Defendant details section and the header is {string}', (expected: string) => {
  log('step', 'Navigate to Defendant details', { expected });
  flow().goToDefendantDetailsAndAssert(expected);
});

When('I go to the Parent or guardian details section and the header is {string}', (expected: string) => {
  log('step', 'Navigate to Parent/Guardian details', { expected });
  flow().goToParentGuardianDetailsAndAssert(expected);
});

/**
 * @step Edits the Defendant details, changing the First name to a given value.
 *
 * @param value - New First name to enter.
 */
When('I edit the Defendant details and change the First name to {string}', (value: string) => {
  log('step', 'Edit Defendant first name', { value });
  flow().editDefendantAndChangeFirstName(value);
});

When('I edit the Defendant details without making changes', () => {
  log('step', 'Edit Defendant details without making changes');
  flow().editDefendantWithoutChanges();
});

When('I edit the Parent or guardian details and change the First name to {string}', (value: string) => {
  log('step', 'Edit Parent/Guardian first name', { value });
  flow().editParentGuardianAndChangeFirstName(value);
});

When('I edit the Parent or guardian details without making changes', () => {
  log('step', 'Edit Parent or guardian details without making changes');
  flow().editParentGuardianDetailsWithoutChanges();
});

When('I edit the Company details and change the Company name to {string}', (value: string) => {
  log('step', 'Edit Company name', { value });
  flow().editCompanyDetailsAndChangeName(value);
});

When('I edit the Company details without making changes', () => {
  log('step', 'Edit Company details without making changes');
  flow().editCompanyDetailsWithoutChanges();
});

When('I save the defendant details', () => {
  log('step', 'Save defendant details');
  flow().saveDefendantDetails();
});

When('I save the parent or guardian details', () => {
  log('step', 'Save parent or guardian details');
  flow().saveParentGuardianDetails();
});

When('I save the company details', () => {
  log('step', 'Save company details');
  flow().saveCompanyDetails();
});

/**
 * @step Attempts to cancel editing and chooses Cancel on the confirmation dialog.
 * Expected result: remain on the edit page.
 */
When('I attempt to cancel editing and choose Cancel on the confirmation dialog', () => {
  log('step', 'Cancel edit and choose Stay');
  flow().cancelEditAndStay();
});

/**
 * @step Verifies that the First name field still contains a given value after cancelling.
 *
 * @param expected - The expected First name value.
 */
Then('I should see the First name field still contains {string}', (expected: string) => {
  log('assert', 'First name should still contain', { expected });
  editDefendantDetails().assertFirstNameValue(expected);
});

/**
 * @step Attempts to cancel editing and chooses “OK” (confirm leave).
 * Expected result: navigate back to the account details page.
 */
When('I attempt to cancel editing and choose OK on the confirmation dialog', () => {
  log('step', 'Cancel edit and leave');
  commonFlow().cancelEditAndLeave();
});

/**
 * @step Ensures we remain on the edit page after cancelling (no navigation occurred).
 */
Then('I should remain on the defendant edit page', () => {
  log('assert', 'Remain on defendant edit page');
  editDefendantDetails().assertStillOnEditPage();
});

/**
 * @step Confirms the user has returned to the account details page defendant tab
 */
Then('I should return to the account details page Defendant tab', () => {
  log('assert', 'Return to Defendant details tab');
  navActions().assertDefendantTabIsActive();
});

Then('I should return to the account details page Parent or guardian tab', () => {
  log('assert', 'Return to Parent/Guardian details tab');
  navActions().assertParentGuardianTabIsActive();
});

/**
 * @step Confirms the user has returned to the account details page at a glance tab
 */
Then('I should return to the account details page At a glance tab', () => {
  log('assert', 'Return to At a glance tab');
  navActions().assertAtAGlanceTabIsActive();
});

Then('I should see the defendant name contains {string}', (expected: string) => {
  log('assert', 'Defendant name contains', { expected });
  flow().assertDefendantNameContains(expected);
});

Then('I should see the parent or guardian name contains {string}', (expected: string) => {
  log('assert', 'Parent or guardian name contains', { expected });
  flow().assertParentGuardianNameContains(expected);
});

Then('I should see the company name contains {string}', (expected: string) => {
  log('assert', 'Company name contains', { expected });
  flow().assertCompanyNameContains(expected);
});

Then('I verify defendant amendments via API for first name {string}', (expectedForename: string) => {
  log('step', 'Verify defendant amendments via API', { expectedForename });
  flow().verifyDefendantAmendmentsViaApi(expectedForename);
});

Then('I verify Company amendments via API for company name {string}', (expectedCompanyName: string) => {
  log('assert', 'Verify company amendments via API', { expectedCompanyName });
  flow().verifyCompanyAmendmentsViaApi(expectedCompanyName);
});

Then('I verify parent or guardian amendments via API for guardian name {string}', (expectedGuardianName: string) => {
  log('assert', 'Verify parent/guardian amendments via API', { expectedGuardianName });
  flow().verifyParentGuardianAmendmentsViaApi(expectedGuardianName);
});

Then('I verify no amendments were created via API', () => {
  log('assert', 'Verify no amendments were created via API');
  flow().verifyNoDefendantAmendments();
});

Then('I verify no amendments were created via API for company details', () => {
  log('assert', 'Verify no amendments were created via API for company details');
  flow().verifyNoCompanyAmendments();
});

Then('I verify no amendments were created via API for parent or guardian details', () => {
  log('assert', 'Verify no amendments were created via API for parent or guardian details');
  flow().verifyNoParentGuardianAmendments();
});

/**
 * @step Validates route-guard behaviour for company edits.
 * It temporarily edits the company name, cancels once, verifies persistence,
 * then cancels again to revert to the original.
 */
When('I verify route guard behaviour when cancelling company edits', () => {
  log('step', 'Verify route guard for company edits');
  flow().verifyRouteGuardBehaviour('Accdetail comp', 'Test');
});

/**
 * @step Validates cancel-changes behaviour for company edits.
 * Edits the company name, cancels, and verifies no persisted changes.
 */
When('I verify cancel-changes behaviour for company edits', () => {
  log('step', 'Verify cancel-changes behaviour for company edits');
  flow().verifyCancelChangesBehaviour('Accdetail comp', 'Test');
});

/**
 * @step Searches for an account by company name.
 *
 * @param companyName - Company name to search by.
 */
When('I search for the account by company name {string}', (companyName: string) => {
  log('step', 'Search by company name', { companyName });
  flow().searchByCompanyName(companyName);
});

/**
 * @step Opens a company account details page by company name.
 *
 * @param companyName - The visible company name to locate and open.
 */
When('I open the company account details for {string}', (companyName: string) => {
  log('step', 'Open company account details', { companyName });
  flow().openCompanyAccountDetailsByNameAndSelectLatest(companyName);
});

/**
 * @step Opens the Add account note screen and verifies that the header text is correct.
 *
 * @example
 * When I open the Add account note screen and verify the header is Add account note
 */
When('I open the Add account note screen and verify the header is Add account note', () => {
  log('step', 'Open Add account note screen');
  cy.location('pathname', { timeout: 10000 }).should('match', /\/fines\/account\/defendant\/\d+\/details$/);
  flow().openAddAccountNoteAndVerifyHeader();
});

/**
 * @step Enters text into the notes field and saves it.
 *
 * @param note - The note text to input and save.
 * @example
 * When I enter "This is a test note" into the notes field and save the note
 */
When('I enter {string} into the notes field and save the note', (note: string) => {
  log('step', 'Enter and save note', { note });
  flow().enterAndSaveNote(note);
});

/**
 * @step Opens the Add account note screen, enters text, and cancels (discarding changes).
 *
 * @param noteText - The note text to input before cancelling.
 * @example
 * When I open the Add account note screen, enter "This is a test account note for validation", and cancel
 */
When('I open the Add account note screen, enter {string}, and cancel', (noteText: string) => {
  log('step', 'Open add note screen, enter text, cancel', { noteText });
  flow().openNotesScreenEnterTextAndCancel(noteText);
});

/**
 * @step Saves comments and verifies we returned to the correct account page header.
 *
 * @example
 *   When I save the following comments and verify the account header is "Mr John ACCDETAILSURNAME":
 *     | field   | text         |
 *     | comment | Comment Test |
 *     | Line 1  | Line1 Test   |
 *     | Line 2  | Line2 Test   |
 *     | Line 3  | Line3 Test   |
 */
When(
  'I save the following comments and verify the account header is {string}:',
  (expectedHeader: string, table: DataTable) => {
    const rows = (table.hashes?.() ?? []) as CommentRow[];
    const texts = rows.map((r) => (r['text'] ?? '').trim()).filter((t) => t.length > 0);

    log('step', 'Save comments and verify header', { expectedHeader });
    flow().saveCommentsAndReturnToSummary(texts);

    atAGlanceDetails().assertHeaderContains(expectedHeader);
  },
);

/**
 * @step Opens the Add account note screen, enters text, and navigates back,
 * confirming the unsaved changes warning.
 *
 * @param noteText - The note text to input before navigating back.
 * @example
 * When I open the Add account note screen, enter "This is a test account note for back button", and navigate back with confirmation
 */
When('I open the Add account note screen, enter {string}, and navigate back with confirmation', (noteText: string) => {
  log('step', 'Open notes, enter text, navigate back w/ confirmation', { noteText });
  flow().openScreenEnterTextAndNavigateBackWithConfirmation(noteText);
});

When('I open the Comments page from the defendant summary and verify the page contents', () => {
  log('step', 'Open Comments from summary');
  flow().openCommentsFromSummaryAndVerifyPageDetails();
});

When('I cancel with confirmation on the Comments page', () => {
  log('step', 'Cancel Comments and confirm leave');

  // Click Cancel and confirm the unsaved-changes dialog
  // comments().clickCancelLink();
  common().cancelEditing(true);

  // Optional defensive check: ensure the Comments page has closed before the summary assertion runs
  cy.location('pathname', { timeout: 10000 }).should('match', /\/fines\/account\/defendant\/\d+\/details$/);
});

/**
 * @step Verifies route guard behaviour on the Comments page:
 *  - opens Comments from summary,
 *  - enters unsaved text,
 *  - cancels without confirmation (remains on Comments and text retained),
 *  - cancels with confirmation (returns to summary) and verifies the header.
 *
 * @example
 *   And I verify route guard behaviour when cancelling comments with "Comment Test"
 */
When('I verify route guard behaviour when cancelling comments with {string}', (noteText: string) => {
  log('step', 'Verify Comments route guard', { noteText });
  flow().verifyRouteGuardBehaviourOnComments(noteText);
});

/**
 * @step Verify updated comments display in Comments section.
 *
 * @example
 * Then Verify updated comments display in Comments section:
 *   | Comment | Comment Test |
 *   | Line 1  | Line1 Test   |
 *   | Line 2  | Line2 Test   |
 *   | Line 3  | Line3 Test   |
 */
Then('Verify updated comments display in Comments section:', (table: DataTable) => {
  const hash = table.rowsHash?.() ?? {};
  const comment = (hash['Comment'] ?? '').trim();
  const lines = ['Line 1', 'Line 2', 'Line 3'].map((k) => (hash[k] ?? '').trim()).filter((v) => v.length > 0);

  log('assert', 'Verify comments display', { comment, lines });
  atAGlanceDetails().assertCommentsSection({ comment, lines });
});

/**
 * @step Assert Comments form is prefilled with the values from the data table.
 * The flow encapsulates opening Comments + field assertions.
 */
Then('I should see the following values on the Comments form:', (table: DataTable) => {
  const hash = rowsHashSafe(table);
  const expected = {
    comment: hash['Comment'],
    line1: hash['Line 1'],
    line2: hash['Line 2'],
    line3: hash['Line 3'],
  } as const;

  log('assert', 'Verify Comments form prefill', expected);
  flow().verifyPrefilledComments(expected);
});

/**
 * @step Validates route-guard behaviour for parent guardian edits.
 * It temporarily edits the first name, cancels once, verifies persistence,
 * then cancels again to revert to the original.
 */
When('I verify route guard behaviour when cancelling Parent or guardian edits', () => {
  log('step', 'Verify Parent/Guardian route guard');
  flow().verifyParentGuardianRouteGuardBehaviour('Miss Catherine GREEN', 'FNAMECHANGE');
});

/**
 * @step Initiates Parent/Guardian edit and cancels without saving (AC3).
 * Thin step → delegates to a single flow.
 */
When('I edit Parent or guardian details but cancel without saving', () => {
  log('step', 'Edit Parent/Guardian → cancel without saving');
  flow().cancelParentGuardianEditWithoutSaving();
});

/**
 * @step Partially edits Parent/Guardian details and chooses to stay on the page.
 * Covers the route-guard "Cancel → Stay" path where the temporary value persists.
 */
When('I partially edit Parent or guardian details and choose to stay on the page', () => {
  log('step', 'Partially edit Parent/Guardian → stay on page');
  flow().cancelParentGuardianEditButStayOnPage();
});

/**
 * @step Verifies the unsaved temporary value remains after Cancel → Stay.
 */
Then('I should see the unsaved value retained for Last name as {string}', (expected: string) => {
  log('assert', 'Verify unsaved PG last name retained', { expected });
  editParentGuardianDetails().verifyLastName(expected);
});

/**
 * @step Discards Parent/Guardian changes after cancelling the edit (Cancel → OK path).
 * Covers the route-guard "Cancel → Discard" behaviour where edits are reverted.
 */
When('I discard Parent or guardian changes', () => {
  log('step', 'Discard Parent/Guardian changes');
  flow().discardParentGuardianChanges();
});
