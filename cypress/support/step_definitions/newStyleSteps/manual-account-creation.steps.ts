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
import { ManualCourtDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/court-details.actions';
import { ManualPersonalDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/personal-details.actions';
import { ManualOffenceDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/offence-details.actions';
import { ManualPaymentTermsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/payment-terms.actions';
import { DashboardActions } from '../../../e2e/functional/opal/actions/dashboard.actions';
import { calculateWeeksInFuture, calculateWeeksInPast } from '../../utils/dateUtils';
import { log } from '../../utils/log.helper';
import { ManualAccountDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/account-details.actions';
import { ManualAccountTaskNavigationActions } from '../../../e2e/functional/opal/actions/manual-account-creation/task-navigation.actions';
import { ManualCompanyDetailsActions } from '../../../e2e/functional/opal/actions/manual-account-creation/company-details.actions';
import { CommonActions } from '../../../e2e/functional/opal/actions/common/common.actions';

const flow = () => new ManualAccountCreationFlow();
const comments = () => new ManualAccountCommentsNotesActions();
const courtDetails = () => new ManualCourtDetailsActions();
const personalDetails = () => new ManualPersonalDetailsActions();
const offenceDetails = () => new ManualOffenceDetailsActions();
const paymentTerms = () => new ManualPaymentTermsActions();
const dashboard = () => new DashboardActions();
const details = () => new ManualAccountDetailsActions();
const nav = () => new ManualAccountTaskNavigationActions();
const companyDetails = () => new ManualCompanyDetailsActions();
const common = () => new CommonActions();
const createAccount = () => new ManualCreateAccountActions();

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
 * @step Confirms the user is on the dashboard.
 */
Then('I should be on the dashboard', () => {
  log('assert', 'Asserting dashboard is visible');
  dashboard().assertDashboard();
});

/**
 * @step Starts a fine manual account with the provided business unit and defendant type.
 */
const parseWeeksValue = (value: string): { weeks: number; direction: 'past' | 'future' } => {
  const match = value.match(/(\d+)\s+weeks?/i);
  const weeks = match ? Number(match[1]) : 0;
  const direction = /future/i.test(value) ? 'future' : 'past';
  return { weeks, direction };
};

const resolveRelativeDate = (value: string): string => {
  const { weeks, direction } = parseWeeksValue(value);
  return direction === 'future' ? calculateWeeksInFuture(weeks) : calculateWeeksInPast(weeks);
};

When(
  'I start a fine manual account for business unit {string} with defendant type {string}',
  (businessUnit: string, defendantType: DefendantType) => {
    log('step', 'Starting manual account creation', { businessUnit, defendantType });
    flow().startFineAccount(businessUnit, defendantType);
  },
);

/**
 * @step Starts a fine manual account and immediately opens a task.
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
 */
When('I open Manual Account Creation from the dashboard', () => {
  log('step', 'Opening Manual Account Creation from dashboard');
  flow().goToManualAccountCreationFromDashboard();
});

/**
 * @step Selects a business unit on the create account page.
 */
When('I select manual account business unit {string}', (businessUnit: string) => {
  log('type', 'Selecting manual account business unit', { businessUnit });
  createAccount().selectBusinessUnit(businessUnit);
});

/**
 * @step Chooses a manual account type.
 */
When('I choose manual account type {string}', (accountType: AccountType) => {
  log('click', 'Selecting manual account type', { accountType });
  createAccount().selectAccountType(accountType);
});

/**
 * @step Chooses a manual defendant type.
 */
When('I choose manual defendant type {string}', (defendantType: DefendantType) => {
  log('click', 'Selecting manual defendant type', { defendantType });
  createAccount().selectDefendantType(defendantType);
});

/**
 * @step Restarts manual fine company account creation after a refresh,
 * selecting the business unit, account type, and defendant type before continuing.
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
 * @step Continues to the manual account details task list.
 */
When('I continue to manual account details', () => {
  log('navigate', 'Continuing to manual account details');
  flow().goToAccountDetails();
});

/**
 * @step Creates a default fine manual account and confirms the task list is visible.
 */
Given('I am viewing account details for a manual account', () => {
  log('step', 'Starting default manual account (West London, Adult or youth)');
  flow().startFineAccount('West London', 'Adult or youth');
});

/**
 * @step Opens a task from the account details list.
 */
When('I view the {string} task', (taskName: ManualAccountTaskName) => {
  log('navigate', 'Opening task', { taskName });
  flow().openTaskFromAccountDetails(taskName);
});

/**
 * @step Asserts the status text for a task list item after returning to account details.
 */
Then(
  'returning to account details the {string} task the status is {string}',
  (taskName: ManualAccountTaskName, expectedStatus: string) => {
    nav().returnToAccountDetails();
    log('assert', 'Checking task status', { taskName, expectedStatus });
    details().assertTaskStatus(taskName, expectedStatus);
  },
);

/**
 * @step Asserts the status text for a task list item.
 */
Then('the {string} task status is {string}', (taskName: ManualAccountTaskName, expectedStatus: string) => {
  log('assert', 'Checking task status', { taskName, expectedStatus });
  details().assertTaskStatus(taskName, expectedStatus);
});

/**
 * @step Returns to account details task list from a manual account form.
 */
When('I return to account details', () => {
  log('navigate', 'Returning to account details');
  nav().returnToAccountDetails();
});

/**
 * @step Provides comments and notes then returns to the task list.
 */
When('I provide account comments {string} and notes {string} from account details', (comment: string, note: string) => {
  log('step', 'Providing account comments and notes from account details', { comment, note });
  details().assertOnAccountDetailsPage();
  flow().provideAccountCommentsAndNotes(comment, note);
});

/**
 * @step Navigates to account comments and notes and provides account comments and notes.
 */
When('I provide account comments {string} and notes {string}', (comment: string, note: string) => {
  details().openTask('Account comments and notes');
  log('step', 'Providing account comments and notes on task', { comment, note });
  comments().setComment(comment);
  comments().setNote(note);
});

/**
 * @step Asserts the Account comments and notes fields contain the expected text.
 */
Then('the manual account comment field shows {string}', (expected: string) => {
  log('assert', 'Verifying account comment value', { expected });
  comments().assertCommentValue(expected);
});

Then('the manual account note field shows {string}', (expected: string) => {
  log('assert', 'Verifying account note value', { expected });
  comments().assertNoteValue(expected);
});

/**
 * @step Cancels out of account comments with a specific choice (stay/leave).
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
 */
When('I refresh the application', () => {
  log('navigate', 'Refreshing the page');
  cy.reload();
});

/**
 * @step Completes court details and remains on the form (navigation handled by caller).
 */
When(
  'I complete manual court details with LJA {string}, PCR {string}, enforcement court {string}',
  (lja: string, pcr: string, enforcementCourt: string) => {
    log('step', 'Completing court details', { lja, pcr, enforcementCourt });
    details().assertOnAccountDetailsPage();
    courtDetails().fillCourtDetails(lja, pcr, enforcementCourt);
  },
);

/**
 * @step Populates manual court details using a data table and opens the Court details task.
 */
When('I have provided manual court details:', (table: DataTable) => {
  const data = table.rowsHash();
  log('step', 'Providing court details from table', data);
  details().assertOnAccountDetailsPage();
  details().openTask('Court details');
  courtDetails().fillCourtDetails(data['LJA'], data['PCR'], data['enforcement court']);
});

/**
 * @step Completes minimum personal details fields.
 */
When(
  'I complete manual personal details with title {string}, first names {string}, last name {string}, address line 1 {string}',
  (title: string, firstNames: string, lastName: string, addressLine1: string) => {
    log('step', 'Completing personal details', { title, firstNames, lastName, addressLine1 });
    details().assertOnAccountDetailsPage();
    personalDetails().fillBasicDetails({ title, firstNames, lastName, addressLine1 });
  },
);

/**
 * @step Populates manual personal details from the account details task using a data table.
 */
When('I have provided manual personal details from account details:', (table: DataTable) => {
  const data = table.rowsHash();
  log('step', 'Providing personal details from table', data);
  nav().navigateToAccountDetails();
  details().openTask('Personal details');
  personalDetails().fillBasicDetails({
    title: data['title'],
    firstNames: data['first names'],
    lastName: data['last name'],
    addressLine1: data['address line 1'],
  });
});

/**
 * @step Adds a single offence with imposition amounts.
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
 */
When('I have provided offence details from account details:', (table: DataTable) => {
  const data = table.rowsHash();
  const offenceDate = resolveRelativeDate(data['offence date']);
  log('step', 'Providing offence details from table', { ...data, offenceDate });
  nav().navigateToAccountDetails();
  details().assertOnAccountDetailsPage();
  details().openTask('Offence details');
  offenceDetails().fillOffenceDetails({
    dateOfSentence: offenceDate,
    offenceCode: data['offence code'],
    resultCode: data['result code'],
    amountImposed: data['amount imposed'],
    amountPaid: data['amount paid'],
  });
  offenceDetails().clickReviewOffence();
});

/**
 * @step Sends offence details for review.
 */
When('I submit the offence details for review', () => {
  log('navigate', 'Submitting offence details for review');
  offenceDetails().clickReviewOffence();
});

/**
 * @step Sets payment terms including collection order and pay-by date.
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

  nav().navigateToAccountDetails();
  details().openTask('Payment terms');
  const collectionWeeks = parseWeeksValue(data['collection order date']).weeks;
  const payByWeeks = parseWeeksValue(data['pay in full by']).weeks;

  paymentTerms().completePayInFullWithCollectionOrder({
    collectionOrder: collectionChoice,
    collectionOrderWeeksInPast: collectionWeeks,
    payByWeeksInFuture: payByWeeks,
  });
});

/**
 * @step Confirms we are on the account details task list.
 */
Then('I am viewing account details', () => {
  log('assert', 'Asserting Account details header');
  details().assertOnAccountDetailsPage();
});

/**
 * @step Confirms we are on the manual account creation start page.
 */
Then('I am viewing manual account creation start', () => {
  log('assert', 'Asserting manual account creation start page');
  cy.location('pathname', { timeout: 20_000 }).should('include', 'create-account');
  createAccount().assertOnCreateAccountPage();
});

/**
 * @step Asserts multiple task statuses using a table.
 */
Then('the task statuses are:', (table: DataTable) => {
  nav().navigateToAccountDetails();
  table.rows().forEach(([task, status]) => {
    log('assert', 'Checking task status from table', { task, status });
    details().assertTaskStatus(task as ManualAccountTaskName, status);
  });
});

/**
 * @step Asserts both comment and note fields at once.
 */
Then(
  'the manual account comment and note fields show {string} and {string}',
  (commentText: string, noteText: string) => {
    log('assert', 'Verifying comment and note fields', { commentText, noteText });
    comments().assertCommentValue(commentText);
    comments().assertNoteValue(noteText);
  },
);
/**
 * @step Opens the Account comments and notes task without navigating (assumes we are already on Account details).
 */
When('I open the Account comments and notes task', () => {
  log('navigate', 'Opening Account comments and notes task (no navigation)');
  details().openTask('Account comments and notes');
  comments().assertHeader();
});

/**
 * @step Completes company details fields from a table.
 *
 * | company name   | ACME LTD |
 * | address line 1 | 12 Main St |
 * | address line 2 | Suite 2 |
 * | address line 3 | City |
 * | postcode       | AB1 2CD |
 */
When('I complete manual company details:', (table: DataTable) => {
  const data = table.rowsHash();
  log('step', 'Completing company details', data);

  if (data['company name'] !== undefined) {
    companyDetails().setCompanyName(data['company name']);
  }
  if (data['address line 1'] !== undefined) {
    companyDetails().setAddressLine1(data['address line 1']);
  }
  if (data['address line 2'] !== undefined) {
    companyDetails().setAddressLine2(data['address line 2']);
  }
  if (data['address line 3'] !== undefined) {
    companyDetails().setAddressLine3(data['address line 3']);
  }
  if (data['postcode'] !== undefined) {
    companyDetails().setPostcode(data['postcode']);
  }
});

/**
 * @step Adds company aliases and populates their names.
 *
 * | alias | name      |
 * | 1     | Alias One |
 * | 2     | Alias Two |
 */
When('I add manual company aliases:', (table: DataTable) => {
  const aliases = table.hashes();
  log('step', 'Adding company aliases', aliases);
  companyDetails().toggleAddAliases(true);

  aliases.forEach((row, index) => {
    if (index > 0) {
      companyDetails().addAnotherAlias();
    }
    companyDetails().setAliasCompanyName(Number(row.alias), row.name);
  });
});

/**
 * @step Asserts alias values.
 */
Then('the manual company aliases are:', (table: DataTable) => {
  const aliases = table.hashes();
  log('assert', 'Asserting company aliases', aliases);
  companyDetails().assertAddAliasesChecked(true);

  aliases.forEach((row) => {
    companyDetails().assertAliasCompanyName(Number(row.alias), row.name);
  });
});

/**
 * @step Asserts company detail field values.
 *
 * | company name   | ACME LTD |
 * | address line 1 | 12 Main St |
 * | address line 2 | Suite 2 |
 * | address line 3 | City |
 * | postcode       | AB1 2CD |
 */
Then('the manual company details fields are:', (table: DataTable) => {
  const data = table.rowsHash();
  log('assert', 'Asserting company details fields', data);

  if (data['company name'] !== undefined) {
    companyDetails().assertFieldValue('company', data['company name']);
  }
  if (data['address line 1'] !== undefined) {
    companyDetails().assertFieldValue('address1', data['address line 1']);
  }
  if (data['address line 2'] !== undefined) {
    companyDetails().assertFieldValue('address2', data['address line 2']);
  }
  if (data['address line 3'] !== undefined) {
    companyDetails().assertFieldValue('address3', data['address line 3']);
  }
  if (data['postcode'] !== undefined) {
    companyDetails().assertFieldValue('postcode', data['postcode']);
  }
});

/**
 * @step Asserts the state of the Add company aliases checkbox.
 */
Then('the manual company aliases checkbox is {string}', (state: 'checked' | 'not checked') => {
  const expected = state.toLowerCase().includes('checked') && !state.toLowerCase().includes('not');
  log('assert', 'Asserting add alias checkbox state', { state, expected });
  companyDetails().assertAddAliasesChecked(expected);
});

/**
 * @step Clears the company name field.
 */
When('I clear the manual company name', () => {
  log('clear', 'Clearing company name field');
  companyDetails().clearCompanyName();
});

/**
 * @step Asserts inline errors on company detail fields.
 */
Then('I see a manual company inline error {string} for {string}', (message: string, fieldLabel: string) => {
  const fieldKey = resolveCompanyFieldKey(fieldLabel);
  log('assert', 'Checking inline error for company details field', { fieldLabel, message });
  companyDetails().assertInlineError(fieldKey, message);
});

/**
 * @step Navigates from company details to defendant contact details.
 */
When('I continue to defendant contact details from company details', () => {
  log('navigate', 'Going to defendant contact details from company details');
  companyDetails().clickAddContactDetails();
  cy.location('pathname', { timeout: 20_000 }).should('include', '/contact-details');
  common().assertHeaderContains('Defendant contact details', 20_000);
});

/**
 * @step Cancels out of company details and selects a confirmation choice.
 */
When('I cancel company details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  const accept = /ok|leave/i.test(choice);
  log('cancel', 'Cancelling company details', { choice, accept });
  common().cancelEditing(accept);
});

/**
 * @step Cancels company details, confirms leaving, and asserts we land on account details.
 */
When('I cancel company details choosing {string} and return to account details', (choice: 'Ok' | 'Leave') => {
  if (!/ok|leave/i.test(choice)) {
    throw new Error('This step must confirm leaving (Ok/Leave). Use the non-composite cancel step for other choices.');
  }
  log('cancel', 'Cancelling company details and returning to account details', { choice });
  common().cancelEditing(true);
  cy.location('pathname', { timeout: 20_000 }).should('include', '/account-details');
  details().assertOnAccountDetailsPage();
});

/**
 * @step Confirms we are on the Company details page.
 */
Then('I am viewing company details', () => {
  log('assert', 'Asserting Company details page');
  companyDetails().assertOnCompanyDetailsPage();
});
