/**
 * @file manual-account-creation.steps.ts
 * @description
 * Cucumber step definitions for Manual Account Creation journeys.
 *
 * @remarks
 * - Steps are thin wrappers that delegate to flows/actions for UI logic.
 * - Logging is applied consistently for traceability in Cypress runs.
 */
import { When, Then, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { ManualAccountCreationFlow } from '../../../e2e/functional/opal/flows/manual-account-creation.flow';
import { ManualAccountTaskName } from '../../../shared/selectors/manual-account-creation/account-details.locators';
import {
  AccountType,
  DefendantType,
  ManualCreateAccountActions,
} from '../../../e2e/functional/opal/actions/manual-account-creation/create-account.actions';
import { ManualAccountCommentsNotesActions } from '../../../e2e/functional/opal/actions/manual-account-creation/account-comments-notes.actions';
import {
  ManualCourtDetailsActions,
  ManualCourtFieldKey,
} from '../../../e2e/functional/opal/actions/manual-account-creation/court-details.actions';
import {
  ManualEmployerDetailsActions,
  ManualEmployerFieldKey,
} from '../../../e2e/functional/opal/actions/manual-account-creation/employer-details.actions';
import { ManualPersonalDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/personal-details.actions';
import { ManualOffenceDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/offence-details.actions';
import { ManualPaymentTermsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/payment-terms.actions';
import { DashboardActions } from '../../../e2e/functional/opal/actions/dashboard.actions';
import { calculateWeeksInFuture, calculateWeeksInPast } from '../../utils/dateUtils';
import { log } from '../../utils/log.helper';
import { ManualAccountDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/account-details.actions';
import { ManualAccountTaskNavigationActions } from '../../../e2e/functional/opal/actions/manual-account-creation/task-navigation.actions';
import { ManualCompanyDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/company-details.actions';
import {
  ManualContactDetailsActions,
  ManualContactFieldKey,
} from '../../../e2e/functional/opal/actions/manual-account-creation/contact-details.actions';
import { CompanyAliasRow } from '../../../e2e/functional/opal/flows/manual-account-creation.flow';
import { CommonActions } from '../../../e2e/functional/opal/actions/common/common.actions';

const flow = () => new ManualAccountCreationFlow();
const comments = () => new ManualAccountCommentsNotesActions();
const courtDetails = () => new ManualCourtDetailsActions();
const employerDetails = () => new ManualEmployerDetailsActions();
const personalDetails = () => new ManualPersonalDetailsActions();
const offenceDetails = () => new ManualOffenceDetailsActions();
const paymentTerms = () => new ManualPaymentTermsActions();
const dashboard = () => new DashboardActions();
const details = () => new ManualAccountDetailsActions();
const nav = () => new ManualAccountTaskNavigationActions();
const companyDetails = () => new ManualCompanyDetailsActions();
const contactDetails = () => new ManualContactDetailsActions();
const common = () => new CommonActions();
const createAccount = () => new ManualCreateAccountActions();

/**
 * @description Normalises a company details label to its logical field key.
 * @param field - Table or step label text (case-insensitive).
 * @returns A canonical company field key used by actions/selectors.
 * @remarks Keeps feature files flexible while ensuring selectors stay centralised.
 * @example resolveCompanyFieldKey('Address line 2') // returns 'address2'
 */
const resolveCompanyFieldKey = (field: string): 'company' | 'address1' | 'address2' | 'address3' | 'postcode' => {
  const normalized = field.toLowerCase();
  if (normalized.includes('company name')) return 'company';
  if (normalized.includes('address line 1')) return 'address1';
  if (normalized.includes('address line 2')) return 'address2';
  if (normalized.includes('address line 3')) return 'address3';
  if (normalized.includes('postcode')) return 'postcode';
  throw new Error(`Unknown company details field: ${field}`);
};

/**
 * @description Normalises a contact details label to its logical field key.
 * @param field - Table or step label text (case-insensitive).
 * @returns Contact field key recognised by ContactDetails actions.
 * @remarks Throws if the label is unknown to catch typos early.
 * @example resolveContactFieldKey('Home telephone number') // returns 'homeNumber'
 */
const resolveContactFieldKey = (field: string): ManualContactFieldKey => {
  const normalized = field.toLowerCase();

  if (normalized.includes('primary email')) return 'primaryEmail';
  if (normalized.includes('secondary email')) return 'secondaryEmail';
  if (normalized.includes('mobile')) return 'mobileNumber';
  if (normalized.includes('home')) return 'homeNumber';
  if (normalized.includes('work')) return 'workNumber';

  throw new Error(`Unknown contact details field: ${field}`);
};

/**
 * @description Normalises a court details label to its logical field key.
 * @param field - Table or step label text (case-insensitive).
 * @returns Court field key recognised by CourtDetails actions.
 * @remarks Used by Court Details data tables to stay selector-agnostic.
 * @example resolveCourtFieldKey('Prosecutor Case Reference (PCR)') // returns 'pcr'
 */
const resolveCourtFieldKey = (field: string): ManualCourtFieldKey => {
  const normalized = field.toLowerCase();

  if (normalized.includes('local justice area') || normalized.includes('sending area')) return 'lja';
  if (normalized.includes('prosecutor case reference') || normalized.includes('pcr')) return 'pcr';
  if (normalized.includes('enforcement court')) return 'enforcementCourt';

  throw new Error(`Unknown court details field: ${field}`);
};

/**
 * @description Normalises an employer details label to its logical field key.
 * @param field - Table or step label text (case-insensitive).
 * @returns Employer field key recognised by EmployerDetails actions.
 * @remarks Throws on unknown labels to prevent selector drift.
 * @example resolveEmployerFieldKey('Employer telephone') // returns 'employerTelephone'
 */
const resolveEmployerFieldKey = (field: string): ManualEmployerFieldKey => {
  const normalized = field.toLowerCase();

  if (normalized.includes('employer name')) return 'employerName';
  if (normalized.includes('employee reference')) return 'employeeReference';
  if (normalized.includes('email')) return 'employerEmail';
  if (normalized.includes('telephone') || normalized.includes('phone')) return 'employerTelephone';
  if (normalized.includes('address line 1')) return 'addressLine1';
  if (normalized.includes('address line 2')) return 'addressLine2';
  if (normalized.includes('address line 3')) return 'addressLine3';
  if (normalized.includes('address line 4')) return 'addressLine4';
  if (normalized.includes('address line 5')) return 'addressLine5';
  if (normalized.includes('postcode')) return 'postcode';

  throw new Error(`Unknown employer details field: ${field}`);
};

/**
 * @step Confirms the user is on the dashboard.
 */
Then('I should be on the dashboard', () => {
  log('assert', 'Asserting dashboard is visible');
  dashboard().assertDashboard();
});

/**
 * @step Starts a fine manual account with the provided business unit and defendant type.
 * @description Navigates the create-account form to land on the Account details task list.
 * @param businessUnit - Business unit name to search and select.
 * @param defendantType - Defendant type option to choose.
 * @remarks Ensures the task list is loaded before later steps run.
 * @example
 *   When I start a fine manual account for business unit "West London" with defendant type "Adult or youth only"
 */
const parseWeeksValue = (value: string): { weeks: number; direction: 'past' | 'future' } => {
  const match = value.match(/(\d+)\s+weeks?/i);
  const weeks = match ? Number(match[1]) : 0;
  const direction = /future/i.test(value) ? 'future' : 'past';
  return { weeks, direction };
};

/**
 * @description Converts a relative weeks expression (e.g., "2 weeks in the past") to an ISO date string.
 * @param value - Human-readable relative date phrase.
 * @returns ISO date string derived from the relative weeks.
 * @remarks Shared across payment/offence date parsing for consistency.
 * @example resolveRelativeDate('3 weeks in the future') // -> '2025-...'
 */
const resolveRelativeDate = (value: string): string => {
  const { weeks, direction } = parseWeeksValue(value);
  return direction === 'future' ? calculateWeeksInFuture(weeks) : calculateWeeksInPast(weeks);
};

/**
 * @step Starts a fine manual account with a specific business unit and defendant type.
 * @description Selects business unit, chooses Fine + defendant type, and continues to Account details.
 * @param businessUnit - Business unit to search for and select.
 * @param defendantType - Defendant type option to select.
 * @remarks Uses the flow layer to keep Gherkin steps intent-driven.
 * @example
 *   When I start a fine manual account for business unit "West London" with defendant type "Adult or youth only"
 */
When(
  'I start a fine manual account for business unit {string} with defendant type {string}',
  (businessUnit: string, defendantType: DefendantType) => {
    log('step', 'Starting manual account creation', { businessUnit, defendantType });
    flow().startFineAccount(businessUnit, defendantType);
  },
);

/**
 * @step Starts a fine manual account and immediately opens a task.
 * @description Runs startFineAccount then opens the requested task from Account details.
 * @param businessUnit - Business unit to search/select.
 * @param defendantType - Defendant type option to select.
 * @param taskName - Task list entry to open after creation.
 * @remarks Chains creation and first task navigation to reduce duplicate steps.
 * @example
 *   When I start a fine manual account for business unit "West London" with defendant type "Adult or youth only" and I view the "Court details" task
 */
When(
  'I start a fine manual account for business unit {string} with defendant type {string} and I view the {string} task',
  (businessUnit: string, defendantType: DefendantType, taskName: ManualAccountTaskName) => {
    log('step', 'Starting manual account creation and opening task', { businessUnit, defendantType, taskName });
    flow().startFineAccountAndOpenTask(businessUnit, defendantType, taskName);
  },
);

/**
 * @step Navigates from the dashboard to the Manual Account Creation start page.
 * @description Asserts dashboard visibility and opens the create-account page.
 * @remarks Keeps navigation reusable for Backgrounds.
 * @example When I open Manual Account Creation from the dashboard
 */
When('I open Manual Account Creation from the dashboard', () => {
  log('step', 'Opening Manual Account Creation from dashboard');
  flow().goToManualAccountCreationFromDashboard();
});

/**
 * @step Selects a business unit on the create account page.
 * @description Types into the autocomplete and picks the first match.
 * @param businessUnit - Business unit name to select.
 * @remarks Uses ManualCreateAccountActions to stay selector-agnostic.
 * @example When I select manual account business unit "West London"
 */
When('I select manual account business unit {string}', (businessUnit: string) => {
  log('type', 'Selecting manual account business unit', { businessUnit });
  createAccount().selectBusinessUnit(businessUnit);
});

/**
 * @step Chooses a manual account type.
 * @description Selects one of the Manual Account type radio options.
 * @param accountType - Account type label (e.g., "Fine").
 * @remarks Keeps account type selection in the actions layer.
 * @example When I choose manual account type "Fine"
 */
When('I choose manual account type {string}', (accountType: AccountType) => {
  log('click', 'Selecting manual account type', { accountType });
  createAccount().selectAccountType(accountType);
});

/**
 * @step Chooses a manual defendant type.
 * @description Selects a defendant type radio option.
 * @param defendantType - Defendant type label.
 * @remarks Delegates to create-account actions for resilience to selector changes.
 * @example When I choose manual defendant type "Adult or youth only"
 */
When('I choose manual defendant type {string}', (defendantType: DefendantType) => {
  log('click', 'Selecting manual defendant type', { defendantType });
  createAccount().selectDefendantType(defendantType);
});

/**
 * @step Restarts manual fine company account creation after a refresh,
 * selecting the business unit, account type, and defendant type before continuing.
 * @param businessUnit - Business unit to select.
 * @param accountType - Account type to choose (e.g., "Fine").
 * @param defendantType - Defendant type to choose.
 */
When(
  'I restart manual fine company account creation for business unit {string} with account type {string} and defendant type {string}',
  (businessUnit: string, accountType: AccountType, defendantType: DefendantType) => {
    log('step', 'Restarting manual account creation after refresh', {
      businessUnit,
      accountType,
      defendantType,
    });
    flow().restartManualAccount(businessUnit, accountType, defendantType);
  },
);

/**
 * @step Restarts a fine manual account after refresh using the provided business unit and defendant type.
 * @param businessUnit - Business unit to re-select.
 * @param defendantType - Defendant type to re-select.
 */
When(
  'I restart manual fine account for business unit {string} with defendant type {string}',
  (businessUnit: string, defendantType: DefendantType) => {
    log('step', 'Restarting manual fine account after refresh', { businessUnit, defendantType });
    flow().restartManualAccount(businessUnit, 'Fine', defendantType);
  },
);

/**
 * @step Continues to the manual account details task list.
 * @description Clicks Continue on create-account and asserts the task list is visible.
 */
When('I continue to manual account details', () => {
  log('navigate', 'Continuing to manual account details');
  flow().goToAccountDetails();
});

/**
 * @step Creates a default fine manual account and confirms the task list is visible.
 * @description Starts a Fine account with default unit/type to ensure Account details page is loaded.
 */
Given('I am viewing account details for a manual account', () => {
  log('step', 'Starting default manual account (West London, Adult or youth)');
  flow().startFineAccount('West London', 'Adult or youth');
});

/**
 * @step Opens a task from the account details list.
 * @description Clicks a task list entry from the Account details page.
 * @param taskName - Display name of the task to open.
 * @remarks Delegates to the flow to assert navigation is correct.
 * @example When I view the "Court details" task
 */
When('I view the {string} task', (taskName: ManualAccountTaskName) => {
  log('navigate', 'Opening task', { taskName });
  flow().openTaskFromAccountDetails(taskName);
});

/**
 * @step Asserts the status text for a task list item after returning to account details.
 * @description Clicks Return, waits for Account details, then checks the task status.
 * @param taskName - Task list entry to verify.
 * @param expectedStatus - Status text expected (e.g., "Provided").
 * @remarks Use when a step includes navigation back to Account details.
 * @example Then returning to account details the "Court details" task the status is "Provided"
 */
Then(
  'returning to account details the {string} task the status is {string}',
  (taskName: ManualAccountTaskName, expectedStatus: string) => {
    log('assert', 'Returning to Account details and checking task status', { taskName, expectedStatus });
    flow().returnToAccountDetailsAndAssertStatus(taskName, expectedStatus);
  },
);

/**
 * @step Asserts the status text for a task list item.
 * @description Checks a task list entry status without additional navigation.
 * @param taskName - Task name to verify.
 * @param expectedStatus - Status text expected.
 * @remarks Assumes the caller is already on Account details.
 * @example Then the "Court details" task status is "Not provided"
 */
Then('the {string} task status is {string}', (taskName: ManualAccountTaskName, expectedStatus: string) => {
  log('assert', 'Checking task status', { taskName, expectedStatus });
  details().assertTaskStatus(taskName, expectedStatus);
});

/**
 * @step Returns to account details task list from a manual account form.
 * @description Clicks Return to account details on the current form.
 * @remarks Use before asserting task statuses to avoid stale context.
 * @example When I return to account details
 */
When('I return to account details', () => {
  log('navigate', 'Returning to account details');
  nav().returnToAccountDetails();
});

/**
 * @step Provides comments and notes then returns to the task list.
 * @description Opens Account comments and notes, sets values, and returns.
 * @param comment - Comment text to enter.
 * @param note - Note text to enter.
 * @remarks Keeps navigation scoped to Account details.
 * @example When I provide account comments "Test comment" and notes "Test note" from account details
 */
When('I provide account comments {string} and notes {string} from account details', (comment: string, note: string) => {
  log('step', 'Providing account comments and notes from account details', { comment, note });
  flow().provideAccountCommentsAndNotes(comment, note);
});

/**
 * @step Navigates to account comments and notes and provides account comments and notes.
 * @description Opens the task (assuming navigation handled) and sets comment/note.
 * @param comment - Comment text to enter.
 * @param note - Note text to enter.
 * @remarks Use when already on Account details or inside the task.
 * @example When I provide account comments "Hello" and notes "World"
 */
When('I provide account comments {string} and notes {string}', (comment: string, note: string) => {
  log('step', 'Providing account comments and notes on task', { comment, note });
  flow().setAccountCommentsAndNotes(comment, note);
});

/**
 * @step Asserts the Account comments and notes fields contain the expected text.
 * @description Verifies comment and note values on the task page.
 * @param expected - Expected text value.
 * @remarks Uses actions for selector resilience.
 */
Then('the manual account comment field shows {string}', (expected: string) => {
  log('assert', 'Verifying account comment value', { expected });
  comments().assertCommentValue(expected);
});

/**
 * @step Asserts the Account note field contains the expected text.
 * @description Verifies the note value on the Account comments and notes task.
 * @param expected - Expected note text.
 * @remarks Uses actions for selector resilience.
 * @example Then the manual account note field shows "Some note"
 */
Then('the manual account note field shows {string}', (expected: string) => {
  log('assert', 'Verifying account note value', { expected });
  comments().assertNoteValue(expected);
});

/**
 * @step Cancels out of account comments with a specific choice (stay/leave).
 * @description Triggers the unsaved changes dialog and selects the given option.
 * @param choice - One of Cancel/Ok/Stay/Leave to drive the confirm.
 * @remarks Accept choices (Ok/Leave) will navigate away; Cancel/Stay keep the user on page.
 * @example When I choose "Cancel" on the unsaved changes prompt for account comments
 */
When(
  'I choose {string} on the unsaved changes prompt for account comments',
  (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
    log('cancel', 'Cancelling from comments page', { choice });
    comments().cancelAndChoose(choice);
  },
);

/**
 * @step Proceeds from comments and notes to review and asserts the destination header.
 * @description Clicks Review and submit from comments and checks the resulting header.
 * @param header - Expected header text fragment on the review page.
 * @remarks Guards against stale headers by asserting location + header.
 * @example Then I can proceed to review account details from comments and notes and see the header "Review account"
 */
Then(
  'I can proceed to review account details from comments and notes and see the header {string}',
  (header: string) => {
    log('flow', 'Proceeding to review from comments and notes', { header });
    flow().proceedToReviewFromComments(header);
  },
);

/**
 * @step Refreshes the current page.
 * @description Performs a hard page reload.
 * @remarks Useful for persistence checks; re-run navigation afterwards as needed.
 * @example When I refresh the application
 */
When('I refresh the application', () => {
  log('navigate', 'Refreshing the page');
  cy.reload();
});

/**
 * @step Completes court details and remains on the form (navigation handled by caller).
 * @description Sets LJA, PCR, and enforcement court fields on the Court details task.
 * @param lja - LJA/autocomplete value.
 * @param pcr - PCR text.
 * @param enforcementCourt - Enforcement court/autocomplete value.
 * @remarks Assumes the caller has already navigated to Court details.
 * @example When I complete manual court details with LJA "Avon", PCR "1234", enforcement court "West London VPFPO"
 */
When(
  'I complete manual court details with LJA {string}, PCR {string}, enforcement court {string}',
  (lja: string, pcr: string, enforcementCourt: string) => {
    log('step', 'Completing court details', { lja, pcr, enforcementCourt });
    flow().completeCourtDetails(lja, pcr, enforcementCourt);
  },
);

/**
 * @step Completes court details from a data table while on the Court details task.
 * @description Maps table labels to court field keys and fills values.
 * @param table - DataTable of court detail fields/values.
 * @remarks Fails fast on unknown labels to avoid silent selector drift.
 * @example
 *   When I complete manual court details:
 *     | Sending area or Local Justice Area (LJA) | Avon |
 */
When('I complete manual court details:', (table: DataTable) => {
  const hash = table.rowsHash();
  const normalized = Object.fromEntries(Object.entries(hash).map(([field, value]) => [field.trim(), value.trim()]));

  log('debug', 'Court details table map', { hash: normalized });

  const payload = Object.entries(normalized).reduce<Partial<Record<ManualCourtFieldKey, string>>>(
    (acc, [field, value]) => {
      if (!field) {
        return acc;
      }

      const key = resolveCourtFieldKey(field);
      acc[key] = value;
      return acc;
    },
    {},
  );

  log('step', 'Completing court details from table', { payload: { ...payload } });
  courtDetails().assertOnCourtDetailsPage();
  courtDetails().fillCourtDetails(payload);
});

/**
 * @step Populates manual court details by opening the task from Account details.
 * @description Navigates via Account details to Court details and fills fields from a table.
 * @param table - DataTable of court detail fields/values.
 * @remarks Handles navigation; use when starting from Account details.
 * @example
 *   When I have provided manual court details:
 *     | Enforcement court | West London VPFPO |
 */
When('I have provided manual court details:', (table: DataTable) => {
  const hash = table.rowsHash();
  const normalized = Object.fromEntries(Object.entries(hash).map(([field, value]) => [field.trim(), value.trim()]));

  const payload = Object.entries(normalized).reduce<Partial<Record<ManualCourtFieldKey, string>>>(
    (acc, [field, value]) => {
      if (!field) {
        return acc;
      }

      const key = resolveCourtFieldKey(field);
      acc[key] = value;
      return acc;
    },
    {},
  );

  log('step', 'Providing court details from table', { payload: { ...payload } });
  flow().provideCourtDetailsFromAccountDetails(payload);
});

/**
 * @step Asserts Court details field values.
 * @description Validates field values on the Court details form using a table map.
 * @param table - DataTable of expected field/value pairs.
 * @remarks Skips header rows like "Field | Value" automatically.
 * @example
 *   Then the manual court details fields are:
 *     | Prosecutor Case Reference (PCR) | 1234 |
 */
Then('the manual court details fields are:', (table: DataTable) => {
  const expected = table.rows().reduce<Partial<Record<ManualCourtFieldKey, string>>>((acc, [field, value]) => {
    if (field.toLowerCase() === 'field' && value.toLowerCase() === 'value') {
      return acc;
    }

    const key = resolveCourtFieldKey(field);
    acc[key] = value.trim();
    return acc;
  }, {});

  log('assert', 'Checking court details field values', { expected });
  flow().assertCourtDetailsFields(expected);
});

/**
 * @step Cancels Court details with a given choice.
 * @description Triggers the unsaved changes prompt and selects the provided option.
 * @param choice - Cancel/Ok/Stay/Leave to respond to the confirm dialog.
 * @remarks Accept choices will navigate away; cancel choices keep the user on Court details.
 * @example When I cancel manual court details choosing "Cancel"
 */
When('I cancel manual court details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  log('cancel', 'Cancelling court details', { choice });
  flow().cancelCourtDetails(choice);
});

/**
 * @step Cancels Court details and asserts navigation to Account details.
 * @description Confirms the dialog (Ok/Leave) and checks we land on Account details.
 * @param choice - Confirmation choice (Ok or Leave).
 * @remarks Throws if a non-confirm choice is supplied to keep behaviour explicit.
 * @example When I cancel manual court details choosing "Ok" and return to account details
 */
When('I cancel manual court details choosing {string} and return to account details', (choice: 'Ok' | 'Leave') => {
  if (!/ok|leave/i.test(choice)) {
    throw new Error('This step must confirm leaving (Ok/Leave). Use the non-composite cancel step for other choices.');
  }

  log('cancel', 'Cancelling court details and returning to account details', { choice });
  flow().cancelCourtDetailsAndReturn(choice);
});

/**
 * @step Confirms we are on the Court details page.
 * @description Asserts URL and header for Court details.
 * @remarks Use before field assertions to guard against stale DOM.
 * @example Then I am viewing court details
 */
Then('I am viewing court details', () => {
  log('assert', 'Asserting Court details page');
  courtDetails().assertOnCourtDetailsPage();
});

/**
 * @step Navigates from Court details to Personal details using the grey CTA.
 * @description Clicks the nested flow button to reach Personal details.
 * @remarks Includes pathname + header guard to avoid stale header assertions.
 * @example When I continue to personal details from court details
 */
When('I continue to personal details from court details', () => {
  log('navigate', 'Continuing to personal details from Court details');
  flow().continueToPersonalDetailsFromCourt();
});

/**
 * @step Completes minimum personal details fields.
 * @description Fills title, first names, last name, and address line 1 on Personal details.
 * @param title - Title option to select.
 * @param firstNames - First names text.
 * @param lastName - Last name text.
 * @param addressLine1 - Address line 1 text.
 * @remarks Assumes the caller handles navigation to Personal details.
 * @example When I complete manual personal details with title "Mr", first names "John", last name "Smith", address line 1 "1 Test St"
 */
When(
  'I complete manual personal details with title {string}, first names {string}, last name {string}, address line 1 {string}',
  (title: string, firstNames: string, lastName: string, addressLine1: string) => {
    log('step', 'Completing personal details', { title, firstNames, lastName, addressLine1 });
    flow().completePersonalDetails({ title, firstNames, lastName, addressLine1 });
  },
);

/**
 * @step Populates manual personal details from the account details task using a data table.
 * @description Opens Personal details from Account details and fills required fields.
 * @param table - DataTable of personal detail fields/values.
 * @remarks Navigation handled via flow; table keys must match expected labels.
 * @example
 *   When I have provided manual personal details from account details:
 *     | title        | Mr    |
 *     | first names  | John  |
 */
When('I have provided manual personal details from account details:', (table: DataTable) => {
  const data = table.rowsHash();
  log('step', 'Providing personal details from table', data);
  flow().providePersonalDetailsFromAccountDetails({
    title: data['title'],
    firstNames: data['first names'],
    lastName: data['last name'],
    addressLine1: data['address line 1'],
  });
});

/**
 * @step Adds a single offence with imposition amounts.
 * @description Fills offence details with a relative date, offence/result codes, and amounts.
 * @param weeksInPast - Weeks before today for the offence date.
 * @param offenceCode - Offence code to enter.
 * @param resultCode - Result code to enter.
 * @param amountImposed - Amount imposed value.
 * @param amountPaid - Amount paid value.
 * @remarks Converts relative weeks to a concrete date via utilities.
 * @example
 *   When I add an offence dated 2 weeks in the past with offence code "ABC" result code "1234" amount imposed "100" and amount paid "50"
 */
When(
  'I add an offence dated {int} weeks in the past with offence code {string}, result code {string}, amount imposed {string}, and amount paid {string}',
  (weeksInPast: number, offenceCode: string, resultCode: string, amountImposed: string, amountPaid: string) => {
    const dateOfSentence = calculateWeeksInPast(weeksInPast);
    log('step', 'Completing offence details', {
      weeksInPast,
      offenceCode,
      resultCode,
      amountImposed,
      amountPaid,
      dateOfSentence,
    });
    details().assertOnAccountDetailsPage();
    offenceDetails().fillOffenceDetails({
      dateOfSentence,
      offenceCode,
      resultCode,
      amountImposed,
      amountPaid,
    });
  },
);

/**
 * @step Populates offence details from account details using a data table.
 * @description Navigates via Account details to Offence details and fills fields from a table.
 * @param table - DataTable containing offence date, offence code, result code, amounts.
 * @remarks Relative dates are normalised via resolveRelativeDate; unknown labels will throw.
 * @example
 *   When I have provided offence details from account details:
 *     | offence date  | 2 weeks in the past |
 *     | offence code  | ABC123              |
 *     | result code   | 4001                |
 *     | amount imposed| 100                 |
 *     | amount paid   | 50                  |
 */
When('I have provided offence details from account details:', (table: DataTable) => {
  const data = table.rowsHash();
  const offenceDate = resolveRelativeDate(data['offence date']);
  log('step', 'Providing offence details from table', { ...data, offenceDate });
  flow().provideOffenceDetailsFromAccountDetails({
    dateOfSentence: offenceDate,
    offenceCode: data['offence code'],
    resultCode: data['result code'],
    amountImposed: data['amount imposed'],
    amountPaid: data['amount paid'],
  });
});

/**
 * @step Sends offence details for review.
 * @description Clicks the review/submit button on Offence details.
 * @remarks Assumes caller has navigated to Offence details.
 * @example When I submit the offence details for review
 */
When('I submit the offence details for review', () => {
  log('navigate', 'Submitting offence details for review');
  offenceDetails().clickReviewOffence();
});

/**
 * @step Sets payment terms including collection order and pay-by date.
 * @description Fills collection order, sets past and future dates relative to today, and submits.
 * @param collectionOrder - Whether collection order is "Yes" or "No".
 * @param weeksInPast - Weeks ago for collection order date.
 * @param weeksInFuture - Weeks ahead for pay-in-full date.
 * @remarks Uses flow to assert Account details context before filling.
 * @example
 *   When I set manual payment terms with collection order "Yes" 1 weeks ago and pay in full by 4 weeks in the future
 */
When(
  'I set manual payment terms with collection order {string} {int} weeks ago and pay in full by {int} weeks in the future',
  (collectionOrder: 'Yes' | 'No', weeksInPast: number, weeksInFuture: number) => {
    log('step', 'Completing payment terms', { collectionOrder, weeksInPast, weeksInFuture });
    details().assertOnAccountDetailsPage();
    paymentTerms().completePayInFullWithCollectionOrder({
      collectionOrder,
      collectionOrderWeeksInPast: weeksInPast,
      payByWeeksInFuture: weeksInFuture,
    });
  },
);

/**
 * @step Populates manual payment terms using a data table.
 * @description Navigates via Account details to Payment terms and fills from a table.
 * @param table - DataTable containing collection order choice/date and pay-by date.
 * @remarks Relative dates are parsed; table labels must match expected keys.
 * @example
 *   When I have provided manual payment terms:
 *     | collection order     | Yes                |
+ *     | collection order date| 2 weeks in the past|
 *     | pay in full by       | 3 weeks in the future |
 */
When('I have provided manual payment terms:', (table: DataTable) => {
  const data = table.rowsHash();
  const collectionDate = resolveRelativeDate(data['collection order date']);
  const payByDate = resolveRelativeDate(data['pay in full by']);
  const collectionChoice = data['collection order'] as 'Yes' | 'No';

  log('step', 'Providing payment terms from table', {
    collectionChoice,
    collectionDate,
    payByDate,
  });

  const collectionWeeks = parseWeeksValue(data['collection order date']).weeks;
  const payByWeeks = parseWeeksValue(data['pay in full by']).weeks;

  flow().providePaymentTermsFromAccountDetails({
    collectionOrder: collectionChoice,
    collectionOrderWeeksInPast: collectionWeeks,
    payByWeeksInFuture: payByWeeks,
  });
});

/**
 * @step Confirms we are on the account details task list.
 * @description Asserts Account details header while on the task list page.
 * @remarks Use to guard subsequent task list interactions.
 * @example Then I am viewing account details
 */
Then('I am viewing account details', () => {
  log('assert', 'Asserting Account details header');
  details().assertOnAccountDetailsPage();
});

/**
 * @step Confirms we are on the manual account creation start page.
 * @description Asserts create-account pathname and page header.
 * @remarks Helpful after refresh/navigation to ensure starting context.
 * @example Then I am viewing manual account creation start
 */
Then('I am viewing manual account creation start', () => {
  log('assert', 'Asserting manual account creation start page');
  cy.location('pathname', { timeout: 20_000 }).should('include', 'create-account');
  createAccount().assertOnCreateAccountPage();
});

/**
 * @step Asserts multiple task statuses using a table.
 * @description Checks task statuses on Account details using a field/value table.
 * @param table - DataTable of task name to status pairs.
 * @remarks Navigation back to Account details is handled in the flow.
 * @example
 *   Then the task statuses are:
 *     | Court details | Provided |
 *     | Contact details | Not provided |
 */
Then('the task statuses are:', (table: DataTable) => {
  const statuses = table.rows().map(([task, status]) => ({
    task: task as ManualAccountTaskName,
    status,
  }));
  log('assert', 'Checking task status from table', { statuses });
  flow().assertTaskStatuses(statuses);
});

/**
 * @step Asserts both comment and note fields at once.
 * @description Verifies the comment and note values in a single assertion helper.
 * @param commentText - Expected comment text.
 * @param noteText - Expected note text.
 * @remarks Uses flow-level helper to reduce duplicate assertions.
 * @example Then the manual account comment and note fields show "c1" and "n1"
 */
Then(
  'the manual account comment and note fields show {string} and {string}',
  (commentText: string, noteText: string) => {
    log('assert', 'Verifying comment and note fields', { commentText, noteText });
    flow().assertAccountCommentsAndNotes(commentText, noteText);
  },
);
/**
 * @step Opens the Account comments and notes task without navigating (assumes we are already on Account details).
 */
When('I open the Account comments and notes task', () => {
  log('navigate', 'Opening Account comments and notes task (no navigation)');
  flow().openAccountCommentsAndNotesTask();
});

/**
 * @step Completes company details fields from a table.
 *
 * | company name   | ACME LTD |
 * | address line 1 | 12 Main St |
 * | address line 2 | Suite 2 |
 * | address line 3 | City |
 * | postcode       | AB1 2CD |
 *
 * @description Fills company form fields using provided table data.
 * @param table - DataTable containing company field/value pairs.
 * @remarks Unknown labels throw to avoid silent selector drift.
 * @example
 *   When I complete manual company details:
 *     | company name   | Example Co |
 *     | address line 1 | 1 Test St  |
 */
When('I complete manual company details:', (table: DataTable) => {
  const data = table.rowsHash();
  log('step', 'Completing company details', data);
  flow().fillCompanyDetailsFromTable(data);
});

/**
 * @step Adds company aliases and populates their names.
 *
 * | alias | name      |
 * | 1     | Alias One |
 * | 2     | Alias Two |
 *
 * @description Adds alias rows and sets their names using table data.
 * @param table - DataTable with alias index and name.
 * @remarks Alias numbers are 1-based.
 * @example
 *   When I add manual company aliases:
 *     | alias | name |
 *     | 1     | Foo  |
 */
When('I add manual company aliases:', (table: DataTable) => {
  const aliases = table.hashes() as CompanyAliasRow[];
  log('step', 'Adding company aliases', { aliases });
  flow().addCompanyAliases(aliases);
});

/**
 * @step Asserts alias values.
 * @description Verifies alias rows match expected names.
 * @param table - DataTable with alias index/name pairs.
 * @example
 *   Then the manual company aliases are:
 *     | alias | name |
 *     | 1     | Foo  |
 */
Then('the manual company aliases are:', (table: DataTable) => {
  const aliases = table.hashes() as CompanyAliasRow[];
  log('assert', 'Asserting company aliases', { aliases });
  flow().assertCompanyAliases(aliases);
});

/**
 * @step Asserts company detail field values.
 *
 * | company name   | ACME LTD |
 * | address line 1 | 12 Main St |
 * | address line 2 | Suite 2 |
 * | address line 3 | City |
 * | postcode       | AB1 2CD |
 *
 * @description Verifies company form fields using a table of expected values.
 * @param table - DataTable of field/value pairs.
 * @remarks Header rows like "field | value" are not expected here.
 * @example
 *   Then the manual company details fields are:
 *     | company name   | Example Co |
 */
Then('the manual company details fields are:', (table: DataTable) => {
  const data = table.rowsHash();
  log('assert', 'Asserting company details fields', data);
  flow().assertCompanyDetailsFields(data);
});

/**
 * @step Asserts the state of the Add company aliases checkbox.
 * @description Checks whether the add-aliases checkbox is checked.
 * @param state - "checked" or "not checked".
 * @example Then the manual company aliases checkbox is "checked"
 */
Then('the manual company aliases checkbox is {string}', (state: 'checked' | 'not checked') => {
  const expected = state.toLowerCase().includes('checked') && !state.toLowerCase().includes('not');
  log('assert', 'Asserting add alias checkbox state', { state, expected });
  companyDetails().assertAddAliasesChecked(expected);
});

/**
 * @step Clears the company name field.
 * @description Removes any value from the company name input.
 * @example When I clear the manual company name
 */
When('I clear the manual company name', () => {
  log('clear', 'Clearing company name field');
  companyDetails().clearCompanyName();
});

/**
 * @step Asserts inline errors on company detail fields.
 * @description Verifies a specific inline error for a company field.
 * @param message - Expected error text.
 * @param fieldLabel - Field label to map to a selector.
 * @example Then I see a manual company inline error "Enter company name" for "Company name"
 */
Then('I see a manual company inline error {string} for {string}', (message: string, fieldLabel: string) => {
  const fieldKey = resolveCompanyFieldKey(fieldLabel);
  log('assert', 'Checking inline error for company details field', { fieldLabel, message });
  companyDetails().assertInlineError(fieldKey, message);
});

/**
 * @step Navigates from company details to defendant contact details.
 * @description Clicks Add contact details and asserts navigation.
 * @remarks Uses flow-level navigation guard.
 * @example When I continue to defendant contact details from company details
 */
When('I continue to defendant contact details from company details', () => {
  log('navigate', 'Going to defendant contact details from company details');
  flow().continueToContactDetailsFromCompany();
});

/**
 * @step Cancels out of company details and selects a confirmation choice.
 * @description Triggers unsaved changes dialog and responds with choice.
 * @param choice - Cancel/Ok/Stay/Leave to respond.
 * @remarks Accept choices leave the page; cancel choices stay.
 * @example When I cancel company details choosing "Cancel"
 */
When('I cancel company details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  const accept = /ok|leave/i.test(choice);
  log('cancel', 'Cancelling company details', { choice, accept });
  common().cancelEditing(accept);
});

/**
 * @step Cancels company details, confirms leaving, and asserts we land on account details.
 * @description Handles confirm dialog and checks Account details header.
 * @param choice - Confirmation choice (Ok/Leave).
 * @remarks Throws if a non-confirm choice is supplied.
 * @example When I cancel company details choosing "Ok" and return to account details
 */
When('I cancel company details choosing {string} and return to account details', (choice: 'Ok' | 'Leave') => {
  if (!/ok|leave/i.test(choice)) {
    throw new Error('This step must confirm leaving (Ok/Leave). Use the non-composite cancel step for other choices.');
  }
  log('cancel', 'Cancelling company details and returning to account details', { choice });
  flow().cancelCompanyDetailsAndReturn(choice);
});

/**
 * @step Confirms we are on the Company details page.
 * @description Asserts URL and header for Company details.
 * @example Then I am viewing company details
 */
Then('I am viewing company details', () => {
  log('assert', 'Asserting Company details page');
  companyDetails().assertOnCompanyDetailsPage();
});

/**
 * @step Completes contact details using provided fields.
 *
 * | primary email   | P@EMAIL.COM |
 * | secondary email | S@EMAIL.COM |
 * | mobile number   | 07123 456 789 |
 *
 * @description Fills contact fields based on the supplied table.
 * @param table - DataTable mapping contact labels to values.
 * @remarks Unknown labels throw; empty payload is logged and skipped.
 * @example
 *   When I complete manual contact details:
 *     | Primary email address | test@example.com |
 */
When('I complete manual contact details:', (table: DataTable) => {
  const hash = table.rowsHash();
  const normalized = Object.fromEntries(Object.entries(hash).map(([field, value]) => [field.trim(), value.trim()]));

  log('debug', 'Contact details table map', { hash: normalized });

  const payload = Object.entries(normalized).reduce<Partial<Record<ManualContactFieldKey, string>>>(
    (acc, [field, value]) => {
      if (!field) {
        return acc;
      }
      const key = resolveContactFieldKey(field);
      acc[key] = value;
      return acc;
    },
    {},
  );

  log('step', 'Completing contact details', { payload: { ...payload } });
  contactDetails().fillContactDetails(payload);
});

/**
 * @step Asserts contact details fields match the expected values.
 * @description Verifies contact field values using a table.
 * @param table - DataTable of contact field/value pairs.
 * @remarks Skips header rows like "Field | Value" if present.
 * @example
 *   Then the manual contact details fields are:
 *     | Primary email address | test@example.com |
 */
Then('the manual contact details fields are:', (table: DataTable) => {
  log('assert', 'Checking contact details field values');

  table.rows().forEach(([field, expected]) => {
    if (field.toLowerCase() === 'field' && expected.toLowerCase() === 'value') {
      return;
    }

    const key = resolveContactFieldKey(field);
    contactDetails().assertFieldValue(key, expected);
  });
});

/**
 * @step Clears a specific contact details field.
 * @description Clears the given contact input based on its label.
 * @param fieldLabel - Label to map to a contact field key.
 * @example When I clear the manual contact "Primary email address" field
 */
When('I clear the manual contact {string} field', (fieldLabel: string) => {
  const key = resolveContactFieldKey(fieldLabel);
  log('clear', 'Clearing contact field', { fieldLabel, key });
  contactDetails().clearField(key);
});

/**
 * @step Handles Cancel on contact details with a given choice.
 * @description Triggers unsaved changes prompt and responds with choice.
 * @param choice - Cancel/Ok/Stay/Leave selection.
 * @remarks Uses flow to assert we remain on or leave the page accordingly.
 * @example When I cancel manual contact details choosing "Cancel"
 */
When('I cancel manual contact details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  log('cancel', 'Cancelling from contact details', { choice });
  flow().cancelContactDetails(choice);
});

/**
 * @step Confirms cancel on contact details and asserts navigation to account details.
 * @description Accepts the confirm dialog and checks we land on Account details.
 * @param choice - Confirmation choice (Ok/Leave).
 * @example When I confirm cancellation of manual contact details "Ok" and I am taken to account details
 */
When(
  'I confirm cancellation of manual contact details {string} and I am taken to account details',
  (choice: 'Ok' | 'Leave') => {
    log('cancel', 'Confirming cancel and returning to account details', { choice });
    flow().confirmContactDetailsCancellation(choice);
  },
);

/**
 * @step Navigates from contact details to employer details.
 * @description Clicks Add employer details and asserts destination.
 * @example When I continue to employer details from contact details
 */
When('I continue to employer details from contact details', () => {
  log('navigate', 'Going to employer details from contact details');
  flow().continueToEmployerDetailsFromContact();
});

/**
 * @step Navigates from contact details to offence details.
 * @description Clicks Add offence details and asserts destination.
 * @example When I continue to offence details from contact details
 */
When('I continue to offence details from contact details', () => {
  log('navigate', 'Going to offence details from contact details');
  flow().continueToOffenceDetailsFromContact();
});

/**
 * @step Asserts inline error on contact details.
 * @description Verifies inline error text for a specific contact field.
 * @param message - Expected error message.
 * @param fieldLabel - Field label to map to a contact key.
 * @example Then I see a manual contact inline error "Enter email" for "Primary email address"
 */
Then('I see a manual contact inline error {string} for {string}', (message: string, fieldLabel: string) => {
  const key = resolveContactFieldKey(fieldLabel);
  log('assert', 'Checking inline error for contact details', { fieldLabel, message });
  contactDetails().assertInlineError(key, message);
});

/**
 * @step Confirms we are on the Contact details page.
 * @description Asserts pathname and header for Contact details.
 * @example Then I am viewing contact details
 */
Then('I am viewing contact details', () => {
  log('assert', 'Asserting Contact details page');
  contactDetails().assertOnContactDetailsPage();
});

/**
 * @step Completes employer details from a data table while on the Employer details task.
 * @description Maps table labels to employer field keys and fills values.
 * @param table - DataTable of employer detail fields/values.
 * @remarks Fails on unknown labels to avoid selector drift.
 * @example
 *   When I complete manual employer details:
 *     | Employer name      | Test Corp |
 *     | Employer telephone | 0123      |
 */
When('I complete manual employer details:', (table: DataTable) => {
  const hash = table.rowsHash();
  const normalized = Object.fromEntries(Object.entries(hash).map(([field, value]) => [field.trim(), value.trim()]));

  log('debug', 'Employer details table map', { hash: normalized });

  const payload = Object.entries(normalized).reduce<Partial<Record<ManualEmployerFieldKey, string>>>(
    (acc, [field, value]) => {
      if (!field) {
        return acc;
      }

      const key = resolveEmployerFieldKey(field);
      acc[key] = value;
      return acc;
    },
    {},
  );

  log('step', 'Completing employer details from table', { payload: { ...payload } });
  employerDetails().assertOnEmployerDetailsPage();
  employerDetails().fillEmployerDetails(payload);
});

/**
 * @step Populates employer details by opening the task from Account details.
 * @description Navigates to Employer details and fills fields from a table.
 * @param table - DataTable of employer detail fields/values.
 * @remarks Use when starting on Account details; navigation handled by flow.
 * @example
 *   When I have provided manual employer details:
 *     | Employer name | Test Corp |
 */
When('I have provided manual employer details:', (table: DataTable) => {
  const hash = table.rowsHash();
  const normalized = Object.fromEntries(Object.entries(hash).map(([field, value]) => [field.trim(), value.trim()]));

  const payload = Object.entries(normalized).reduce<Partial<Record<ManualEmployerFieldKey, string>>>(
    (acc, [field, value]) => {
      if (!field) {
        return acc;
      }
      const key = resolveEmployerFieldKey(field);
      acc[key] = value;
      return acc;
    },
    {},
  );

  log('step', 'Providing employer details from table', { payload: { ...payload } });
  flow().provideEmployerDetailsFromAccountDetails(payload);
});

/**
 * @step Asserts employer details field values.
 * @description Validates employer field values using a table map.
 * @param table - DataTable of expected field/value pairs.
 * @remarks Header rows like "Field | Value" will be ignored.
 * @example
 *   Then the manual employer details fields are:
 *     | Employer name | Test Corp |
 */
Then('the manual employer details fields are:', (table: DataTable) => {
  const expected = table.rows().reduce<Partial<Record<ManualEmployerFieldKey, string>>>((acc, [field, value]) => {
    if (field.toLowerCase() === 'field' && value.toLowerCase() === 'value') {
      return acc;
    }

    const key = resolveEmployerFieldKey(field);
    acc[key] = value.trim();
    return acc;
  }, {});

  log('assert', 'Checking employer details field values', { expected });
  flow().assertEmployerDetailsFields(expected);
});

/**
 * @step Handles Cancel on employer details with a given choice.
 * @description Triggers the unsaved changes prompt and responds with choice.
 * @param choice - Cancel/Ok/Stay/Leave selection.
 * @remarks Accept choices will leave the page; cancel choices keep the user on Employer details.
 * @example When I cancel manual employer details choosing "Cancel"
 */
When('I cancel manual employer details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  log('cancel', 'Cancelling employer details', { choice });
  flow().cancelEmployerDetails(choice);
});

/**
 * @step Cancels employer details and asserts navigation to Account details.
 * @description Accepts the confirm dialog (Ok/Leave) and checks Account details.
 * @param choice - Confirmation choice (Ok/Leave).
 * @remarks Throws if a non-confirm choice is supplied.
 * @example When I cancel manual employer details choosing "Ok" and return to account details
 */
When('I cancel manual employer details choosing {string} and return to account details', (choice: 'Ok' | 'Leave') => {
  if (!/ok|leave/i.test(choice)) {
    throw new Error('This step must confirm leaving (Ok/Leave). Use the non-composite cancel step for other choices.');
  }

  log('cancel', 'Cancelling employer details and returning to account details', { choice });
  flow().cancelEmployerDetailsAndReturn(choice);
});

/**
 * @step Confirms we are on the Employer details page.
 * @description Asserts pathname and header for Employer details.
 * @example Then I am viewing employer details
 */
Then('I am viewing employer details', () => {
  log('assert', 'Asserting Employer details page');
  employerDetails().assertOnEmployerDetailsPage();
});

/**
 * @step Navigates from Employer details to Offence details using the grey CTA.
 * @description Clicks the nested flow button to reach Offence details.
 * @remarks Includes pathname + header guard to avoid stale assertions.
 * @example When I continue to offence details from employer details
 */
When('I continue to offence details from employer details', () => {
  log('navigate', 'Continuing to offence details from Employer details');
  flow().continueToOffenceDetailsFromEmployer();
});
