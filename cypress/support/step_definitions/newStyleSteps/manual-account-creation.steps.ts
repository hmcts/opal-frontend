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
import { ManualPaymentTermsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/payment-terms.actions';
import { DashboardActions } from '../../../e2e/functional/opal/actions/dashboard.actions';
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
import {
  LanguageOption,
  LanguageSection,
  ManualLanguagePreferencesActions,
} from '../../../e2e/functional/opal/actions/manual-account-creation/language-preferences.actions';
import {
  LanguagePreferenceLabel,
  resolveCompanyFieldKey,
  resolveContactFieldKey,
  resolveCourtFieldKey,
  resolveEmployerFieldKey,
  resolveLanguageLabel,
  resolveLanguageSection,
} from '../../utils/macFieldResolvers';
import { parseWeeksValue, resolveRelativeDate } from '../../utils/dateUtils';
import { normalizeHash, normalizeTableRows } from '../../utils/cucumberHelpers';
import { accessibilityActions } from '../../../e2e/functional/opal/actions/accessibility/accessibility.actions';

const flow = () => new ManualAccountCreationFlow();
const comments = () => new ManualAccountCommentsNotesActions();
const courtDetails = () => new ManualCourtDetailsActions();
const employerDetails = () => new ManualEmployerDetailsActions();
const personalDetails = () => new ManualPersonalDetailsActions();
const paymentTerms = () => new ManualPaymentTermsActions();
const dashboard = () => new DashboardActions();
const details = () => new ManualAccountDetailsActions();
const nav = () => new ManualAccountTaskNavigationActions();
const companyDetails = () => new ManualCompanyDetailsActions();
const contactDetails = () => new ManualContactDetailsActions();
const common = () => new CommonActions();
const createAccount = () => new ManualCreateAccountActions();
const languagePreferences = () => new ManualLanguagePreferencesActions();

/**
 * @step Confirms the user is on the dashboard.
 * @description Asserts the dashboard is visible to ensure navigation is in a known state.
 */
Then('I should be on the dashboard', () => {
  log('assert', 'Asserting dashboard is visible');
  dashboard().assertDashboard();
});

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
 * @step Starts a fine manual account relying on the default/only business unit.
 * @description For single-BU users where the business unit is preselected; skips explicit BU entry.
 * @param defendantType - Defendant type option to choose.
 */
When(
  'I start a fine manual account using the default business unit with defendant type {string}',
  (defendantType: DefendantType) => {
    log('step', 'Starting manual account creation with default business unit (no BU provided)', { defendantType });
    flow().startFineAccount('default business unit', defendantType);
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
 * @step Restarts a fine manual account using the default/only business unit after a refresh.
 * @param defendantType - Defendant type to re-select.
 */
When(
  'I restart manual fine account using the default business unit with defendant type {string}',
  (defendantType: DefendantType) => {
    log('step', 'Restarting manual fine account with default business unit after refresh', { defendantType });
    flow().restartManualAccount('default business unit', 'Fine', defendantType);
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
 * @step Sets payment terms including collection order and pay-by date.
 * @description Fills collection order with past date and a future pay-in-full date.
 * @param collectionOrder - Whether collection order is "Yes" or "No".
 * @param weeksInPast - Weeks ago for collection order date.
 * @param weeksInFuture - Weeks ahead for pay-in-full date.
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
 *     | collection order      | Yes                 |
 *     | collection order date | 2 weeks in the past |
 *     | pay in full by        | 3 weeks in the future |
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
 * @step Asserts the language preference summary rows on Account details.
 * @description Uses the Account details summary list to verify Document/Hearing language values.
 * @param table - DataTable mapping section to expected value.
 * @remarks Normalises table keys/values before asserting to avoid whitespace sensitivity.
 * @example
 *   Then the manual language preferences in account details are:
 *     | Documents      | English only      |
 *     | Court hearings | Welsh and English |
 */
Then('the manual language preferences in account details are:', (table: DataTable) => {
  const hash = table.rowsHash();
  const normalized = Object.fromEntries(Object.entries(hash).map(([key, value]) => [key.trim(), value.trim()]));

  log('assert', 'Checking account language preferences summary', { preferences: normalized });

  Object.entries(normalized).forEach(([section, value]) => {
    const label = resolveLanguageLabel(section);
    details().assertLanguagePreference(label, value);
  });
});

/**
 * @step Opens the Language preferences page via the Account details change link.
 * @description Clicks the Change link for the specified language row and asserts the destination page.
 * @param section - Section text (e.g., "Documents" or "Court hearings").
 * @remarks Guards with pathname + header assertions to avoid stale content.
 * @example When I open manual language preferences from account details for "Documents"
 */
When('I open manual language preferences from account details for {string}', (section: string) => {
  const label = resolveLanguageLabel(section);
  log('navigate', 'Opening language preferences from Account details', { section, label });
  flow().openLanguagePreferencesFromAccountDetails(label);
});

/**
 * @step Alias: view the Language preferences page from Account details.
 * @description Opens the Language preferences change link for the given section.
 * @param section - Section text (e.g., "Documents" or "Court hearings").
 */
When('I view manual language preferences from account details for {string}', (section: string) => {
  const label = resolveLanguageLabel(section);
  log('navigate', 'Viewing language preferences from Account details', { section, label });
  flow().openLanguagePreferencesFromAccountDetails(label);
});

/**
 * @step Confirms we are on the Language preferences page.
 * @description Guards against stale headers by asserting pathname and header text.
 * @example Then I am viewing manual language preferences
 */
Then('I am viewing manual language preferences', () => {
  log('assert', 'Asserting Language preferences page');
  languagePreferences().assertOnLanguagePreferencesPage();
});

/**
 * @step Asserts specific language preference options are visible.
 * @description Accepts a two-column table of section and option labels.
 * @param table - DataTable with section/option pairs.
 * @remarks Header rows labelled "Section | Option" are ignored automatically.
 * @example
 *   Then the manual language preference options are visible:
 *     | Section   | Option            |
 *     | Documents | Welsh and English |
 */
Then('the manual language preference options are visible:', (table: DataTable) => {
  const rows = table
    .rows()
    .map(([section, option]) => [section.trim(), option.trim()] as [string, string])
    .filter(([section, option]) => {
      const isHeader = section.toLowerCase() === 'section' && option.toLowerCase() === 'option';
      return !isHeader && section !== '' && option !== '';
    })
    .map(([section, option]) => ({
      section: resolveLanguageSection(section),
      option: option as LanguageOption,
    }));

  log('assert', 'Asserting language preference option visibility', { rows });

  rows.forEach(({ section, option }) => languagePreferences().assertOptionVisible(section, option));
});

/**
 * @step Sets language preferences using a data table.
 * @description Maps section labels to Document/Hearing selections and applies them on the page.
 * @param table - DataTable mapping section to desired option.
 * @remarks Logs and skips when the table produces an empty payload.
 * @example
 *   When I set manual language preferences:
 *     | Documents      | Welsh and English |
 *     | Court hearings | Welsh and English |
 */
When('I set manual language preferences:', (table: DataTable) => {
  const hash = table.rowsHash();
  const normalized = Object.fromEntries(Object.entries(hash).map(([section, value]) => [section.trim(), value.trim()]));

  const payload = Object.entries(normalized).reduce<Partial<Record<LanguagePreferenceLabel, LanguageOption>>>(
    (acc, [section, value]) => {
      const label = resolveLanguageLabel(section);
      acc[label] = value as LanguageOption;
      return acc;
    },
    {},
  );

  log('step', 'Setting language preferences from table', { payload: { ...payload } });
  if (Object.keys(payload).length === 0) {
    log('warn', 'Language preferences payload is empty; no selections will be made');
    return;
  }
  flow().setLanguagePreferences(payload);
});

/**
 * @step Updates language preferences and saves.
 * @description Maps table entries to preferences, applies them, and saves to return to Account details.
 * @param table - DataTable mapping section to desired option.
 */
When('I update manual language preferences to:', (table: DataTable) => {
  const hash = table.rowsHash();
  const normalized = Object.fromEntries(Object.entries(hash).map(([section, value]) => [section.trim(), value.trim()]));

  const payload = Object.entries(normalized).reduce<Partial<Record<LanguagePreferenceLabel, LanguageOption>>>(
    (acc, [section, value]) => {
      const label = resolveLanguageLabel(section);
      acc[label] = value as LanguageOption;
      return acc;
    },
    {},
  );

  log('step', 'Updating language preferences and saving', { payload: { ...payload } });

  if (Object.keys(payload).length === 0) {
    log('warn', 'Language preferences payload is empty; no selections will be made');
    return;
  }

  flow().setLanguagePreferences(payload);
  flow().saveLanguagePreferencesAndReturn();
});

/**
 * @step Asserts language selections on the Language preferences page.
 * @description Uses a three-column table: Section | Option | State ("selected"/"not selected").
 * @param table - DataTable detailing expected selection state.
 * @remarks Interprets any state containing "not" as not selected; all others must be selected.
 * @example
 *   Then the manual language preference selections are:
 *     | section        | option            | state    |
 *     | Documents      | Welsh and English | selected |
 */
Then('the manual language preference selections are:', (table: DataTable) => {
  const expectations = table.hashes().map((row) => ({
    section: resolveLanguageSection((row['section'] ?? row['Section'] ?? '').trim()),
    option: (row['option'] ?? row['Option'] ?? '').trim() as LanguageOption,
    state: (row['state'] ?? row['State'] ?? '').trim().toLowerCase(),
  }));

  log('assert', 'Asserting language preference selections', { expectations });

  expectations.forEach(({ section, option, state }) => {
    const shouldBeSelected = !state.includes('not');
    languagePreferences().assertLanguageSelected(section, option, shouldBeSelected);
  });
});

/**
 * @step Saves language preferences and returns to Account details.
 * @remarks Asserts the Account details header after saving to avoid stale content.
 * @example When I save manual language preferences
 */
When('I save manual language preferences', () => {
  log('navigate', 'Saving language preferences');
  flow().saveLanguagePreferencesAndReturn();
});

/**
 * @step Opens Language preferences from Account details and runs accessibility checks.
 * @param section - Section to open from Account details.
 */
When(
  'I view manual language preferences from account details for {string} and check accessibility',
  (section: string) => {
    const label = resolveLanguageLabel(section);
    log('a11y', 'Opening language preferences for accessibility check', { section, label });
    flow().openLanguagePreferencesFromAccountDetails(label);
    accessibilityActions().checkAccessibilityOnly();
  },
);

/**
 * @step Cancels out of language preferences with a chosen dialog response.
 * @param choice - Confirmation choice (Cancel/Ok/Stay/Leave).
 * @remarks Use this when remaining on the page or when the navigation outcome is asserted separately.
 * @example When I cancel manual language preferences choosing "Cancel"
 */
When('I cancel manual language preferences choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  log('cancel', 'Cancelling language preferences', { choice });
  flow().cancelLanguagePreferences(choice);
});

/**
 * @step Cancels language preferences, confirms leaving, and asserts return to Account details.
 * @param choice - Confirmation choice (Ok/Leave).
 * @remarks Throws if a non-confirm choice is supplied to keep intent explicit.
 * @example When I cancel manual language preferences choosing "Ok" and return to account details
 */
When(
  'I cancel manual language preferences choosing {string} and return to account details',
  (choice: 'Ok' | 'Leave') => {
    if (!/ok|leave/i.test(choice)) {
      throw new Error(
        'This step must confirm leaving (Ok/Leave). Use the non-composite cancel step for other choices.',
      );
    }
    log('cancel', 'Cancelling language preferences and returning to Account details', { choice });
    flow().cancelLanguagePreferencesAndReturn(choice);
  },
);

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
 * @step Asserts a single task status while on Account details.
 * @description Checks the status text for the given task list entry.
 * @param taskName - Task list entry to verify.
 * @param expectedStatus - Expected status text (e.g., "Provided").
 * @example Then the "Offence details" task status is "Provided"
 */
Then('the {string} task status is {string}', (taskName: ManualAccountTaskName, expectedStatus: string) => {
  log('assert', 'Checking single task status', { taskName, expectedStatus });
  details().assertTaskStatus(taskName, expectedStatus);
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
 * @step Opens the Account comments and notes task without navigating.
 * @description Clicks the "Account comments and notes" entry on the task list when already on Account details.
 * @remarks Use after confirming the Account details page is loaded; does not perform navigation from other pages.
 * @example When I open the Account comments and notes task
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
/**
 * @step Continue from Employer details to Offence details.
 * @description Uses the grey CTA on Employer details and asserts the Offence details page.
 */
When('I continue to offence details from employer details', () => {
  log('navigate', 'Continuing to offence details from Employer details');
  flow().continueToOffenceDetailsFromEmployer();
});
