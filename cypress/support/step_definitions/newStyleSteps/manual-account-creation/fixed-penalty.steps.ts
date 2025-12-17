/**
 * Step definitions for Fixed Penalty Manual Account Creation.
 * Wires Cucumber steps to Cypress flows/actions for the Fixed Penalty journey.
 */
import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { DefendantType } from '../../../../e2e/functional/opal/actions/manual-account-creation/create-account.actions';
import { FixedPenaltyFlow } from '../../../../e2e/functional/opal/flows/fixed-penalty.flow';
import { FixedPenaltyDetailsActions } from '../../../../e2e/functional/opal/actions/manual-account-creation/fixed-penalty-details.actions';
import { FixedPenaltyReviewActions } from '../../../../e2e/functional/opal/actions/manual-account-creation/fixed-penalty-review.actions';
import { DraftAccountsInterceptActions } from '../../../../e2e/functional/opal/actions/draft-accounts.intercepts';
import { DraftTabsActions, InputterTab, CheckerTab } from '../../../../e2e/functional/opal/actions/draft-tabs.actions';
import { log } from '../../../utils/log.helper';
import { CommonActions } from '../../../../e2e/functional/opal/actions/common/common.actions';
import { installDraftAccountCleanup } from '../../../../support/draftAccounts';

installDraftAccountCleanup();

const flow = () => new FixedPenaltyFlow();
const details = () => new FixedPenaltyDetailsActions();
const review = () => new FixedPenaltyReviewActions();
const intercepts = () => new DraftAccountsInterceptActions();
const tabs = () => new DraftTabsActions();
const common = () => new CommonActions();

const mapSummaryRows = (table: DataTable) =>
  table
    .rows()
    .map(([label, value]) => ({ label: label.trim(), value: (value ?? '').trim() }))
    .filter(({ label }) => !!label && !/^label$/i.test(label));

const mapFieldExpectations = (table: DataTable) => {
  const rows = table.rows();
  const hasHeader = rows.length > 0 && rows[0][0].toLowerCase() === 'field';
  const relevantRows = hasHeader ? rows.slice(1) : rows;
  return Object.fromEntries(relevantRows.map(([field, value]) => [field, value]));
};

/**
 * @step Starts a Fixed Penalty account with the provided business unit and defendant type.
 * @description Navigates from the dashboard into Manual Account Creation and selects Fixed Penalty + defendant type.
 * @param businessUnit - Business unit option to pick.
 * @param defendantType - Defendant type option to pick.
 * @example
 *   When I start a fixed penalty account for business unit "West London" and defendant type "Adult or youth only"
 */
When(
  'I start a fixed penalty account for business unit {string} and defendant type {string}',
  (businessUnit: string, defendantType: DefendantType) => {
    log('step', 'Starting fixed penalty account', { businessUnit, defendantType });
    flow().startFixedPenaltyAccount(businessUnit, defendantType);
  },
);

/**
 * @step Completes the Fixed Penalty details form using a Section/Field/Value table.
 * @description Maps the provided table into the composite details payload and fills the form.
 * @param table - DataTable containing Section, Field, Value columns.
 * @example
 *   When I complete fixed penalty details:
 *     | Section          | Field         | Value   |
 *     | Personal details | First names   | John    |
 */
When('I complete fixed penalty details:', (table: DataTable) => {
  log('step', 'Completing fixed penalty details from table');
  flow().completeDetailsFromTable(table.raw());
});

/**
 * @step Proceeds to the Fixed Penalty review page.
 * @description Clicks Review Account and asserts the review page is displayed.
 */
When('I review the fixed penalty account', () => {
  log('navigate', 'Proceeding to fixed penalty review');
  flow().goToReview();
});

/**
 * @step Attempts to proceed to review while expecting validation errors.
 * @description Clicks Review Account but asserts we stay on details due to validation failures.
 */
When('I attempt to review the fixed penalty account', () => {
  log('navigate', 'Attempting to review fixed penalty account (expecting validation errors)');
  flow().attemptReviewExpectingErrors();
});

/**
 * @step Asserts a review summary section contains expected rows.
 * @description Validates summary list label/value pairs for the given section.
 * @param section - Section name (e.g., "Offence details").
 * @param table - DataTable of Label/Value rows.
 * @example
 *   Then the fixed penalty review "Offence details" summary is:
 *     | Label          | Value   |
 *     | Notice number  | FPN1234 |
 */
Then('the fixed penalty review {string} summary is:', (section: string, table: DataTable) => {
  const rows = mapSummaryRows(table);
  log('assert', 'Asserting fixed penalty review summary', { section, rows });
  review().assertSummary(section, rows);
});

/**
 * @step Opens change links for multiple review sections and returns to review.
 * @description Iterates provided sections, clicks Change, asserts details page, then returns to review.
 * @param table - DataTable with a single Section column.
 * @example
 *   When I change the fixed penalty sections from review:
 *     | Section          |
 *     | Personal details |
 *     | Offence details  |
 */
When('I change the fixed penalty sections from review:', (table: DataTable) => {
  const sections = table
    .rows()
    .map(([section]) => section.trim())
    .filter(Boolean)
    .filter((section) => !/^section$/i.test(section));

  if (!sections.length) {
    throw new Error('No sections provided to change from review');
  }

  sections.forEach((section) => {
    log('navigate', `Opening change link from review (${section})`, { section });
    flow().openChangeAndReturnToReview(section);
  });
});

/**
 * @step Returns from the review page to Fixed Penalty details.
 * @description Clicks Back on review and asserts the details page is shown.
 */
When('I return to fixed penalty details from review', () => {
  log('navigate', 'Returning to Fixed Penalty details from review');
  flow().goBackFromReview();
});

/**
 * @step Opens the delete account flow from review.
 * @description Clicks Delete account on the Fixed Penalty review page.
 */
When('I request fixed penalty account deletion', () => {
  log('navigate', 'Opening delete account from review');
  review().openDeleteAccount();
});

/**
 * @step Cancels the delete account confirmation.
 * @description Clicks the cancel option on the delete confirmation page.
 */
When('I cancel fixed penalty account deletion', () => {
  log('cancel', 'Cancelling delete account confirmation');
  review().cancelDeletion();
});

/**
 * @step Submits the fixed penalty account and records the generated account number.
 * @description Clicks Submit for review, waits for POST response, and logs the id for cleanup.
 */
When('I submit the fixed penalty account for review and capture the account number', () => {
  log('navigate', 'Submitting fixed penalty account and capturing id');
  flow().submitForReviewAndCapture();
});

/**
 * @step Submits the fixed penalty account for review.
 * @description Clicks Submit for review without capturing the account id.
 */
When('I submit the fixed penalty account for review', () => {
  log('navigate', 'Submitting fixed penalty account');
  flow().submitForReview();
});

/**
 * @step Stubs the submit-for-review call to return a specific status.
 * @description Intercepts POST /draft-accounts and forces the given error code.
 * @param statusCode - HTTP status to stub.
 */
When('I stub fixed penalty submission as failing with status {int}', (statusCode: number) => {
  log('intercept', 'Stubbing fixed penalty submission failure', { statusCode });
  flow().stubSubmitError(statusCode);
});

/**
 * @step Asserts the Fixed Penalty review page shows the global error banner.
 * @description Checks for the standard failure banner on the review screen.
 */
Then('I see the fixed penalty global error banner', () => {
  log('assert', 'Checking global error banner');
  review().assertGlobalErrorBanner();
});

/**
 * @step Cancels out of Fixed Penalty details via the Cancel control.
 * @description Handles the unsaved changes confirmation with the provided choice.
 * @param choice - "Ok" to leave or "Cancel" to stay.
 */
When('I cancel fixed penalty details choosing {string}', (choice: 'Ok' | 'Cancel') => {
  log('cancel', 'Cancelling fixed penalty details', { choice });
  details().cancelAndChoose(choice);
});

/**
 * @step Asserts Fixed Penalty details fields contain expected values.
 * @description Maps a Field/Value table into assertions on the details form.
 * @param table - DataTable of field/value pairs.
 */
Then('the fixed penalty details fields are:', (table: DataTable) => {
  const expected = mapFieldExpectations(table);
  log('assert', 'Asserting fixed penalty field values', { expected });
  details().assertFields(expected);
});

/**
 * @step Asserts a specific inline or summary error for a Fixed Penalty field.
 * @description Checks for the provided validation message tied to the given field label.
 * @param message - Expected validation text.
 * @param fieldLabel - Human-readable field label.
 */
Then('I see a fixed penalty error {string} for {string}', (message: string, fieldLabel: string) => {
  log('assert', 'Asserting fixed penalty inline error', { fieldLabel, message });
  details().assertInlineError(fieldLabel, message);
});

/**
 * @step Navigates browser back from Fixed Penalty details, handling unsaved changes.
 * @description Triggers browser back and responds to the confirm dialog with the given choice.
 * @param choice - "Ok" to leave or "Cancel" to stay.
 */
When('I navigate back from fixed penalty details choosing {string}', (choice: 'Ok' | 'Cancel') => {
  const accept = choice.toLowerCase() === 'ok';
  log('navigate', 'Browser back from fixed penalty details', { choice });
  common().confirmNextUnsavedChanges(accept);
  cy.go('back');
});

/**
 * @step Stubs fixed penalty draft account listings API.
 * @description Intercepts GET /draft-accounts and serves fixture data filtered by status query.
 */
Given('I stub fixed penalty draft account listings', () => {
  log('intercept', 'Stubbing fixed penalty draft listings');
  intercepts().stubFixedPenaltyListings();
});

/**
 * @step Opens the Create and Manage Draft Accounts page for inputters.
 * @description Clicks the dashboard link and asserts the inputter view header.
 */
When('I open Create and Manage Draft Accounts', () => {
  log('navigate', 'Opening Create and Manage Draft Accounts');
  tabs().openInputterTabs();
});

/**
 * @step Opens the Check and Validate Draft Accounts page for checkers.
 * @description Clicks the dashboard link and asserts the checker view header.
 */
When('I open Check and Validate Draft Accounts', () => {
  log('navigate', 'Opening Check and Validate Draft Accounts');
  tabs().openCheckerTabs();
});

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

/**
 * @step Asserts the account type column shows Fixed Penalty.
 * @description Checks the draft listings table for the Fixed Penalty account type text.
 */
Then('I see fixed penalty in the account type column', () => {
  log('assert', 'Checking account type column for Fixed Penalty');
  tabs().assertAccountType('Fixed Penalty');
});
