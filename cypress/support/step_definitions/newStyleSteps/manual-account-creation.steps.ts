import { When, Then, Given, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { ManualAccountCreationFlow } from '../../../e2e/functional/opal/flows/manual-account-creation.flow';
import { ManualAccountTaskName } from '../../../shared/selectors/manual-account-creation/account-details.locators';
import { DefendantType } from '../../../e2e/functional/opal/actions/manual-account-creation/create-account.actions';
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

const flow = () => new ManualAccountCreationFlow();
const comments = () => new ManualAccountCommentsNotesActions();
const courtDetails = () => new ManualCourtDetailsActions();
const personalDetails = () => new ManualPersonalDetailsActions();
const offenceDetails = () => new ManualOffenceDetailsActions();
const paymentTerms = () => new ManualPaymentTermsActions();
const dashboard = () => new DashboardActions();
const details = () => new ManualAccountDetailsActions();
const nav = () => new ManualAccountTaskNavigationActions();

/**
 * Confirms the user is on the dashboard.
 */
Then('I should be on the dashboard', () => {
  log('assert', 'Asserting dashboard is visible');
  dashboard().assertDashboard();
});

/**
 * Starts a fine manual account with the provided business unit and defendant type.
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

Given(
  'I start a fine manual account for business unit {string} with defendant type {string}',
  (businessUnit: string, defendantType: DefendantType) => {
    log('step', 'Starting manual account creation', { businessUnit, defendantType });
    flow().startFineAccount(businessUnit, defendantType);
  },
);

/**
 * Creates a default fine manual account and confirms the task list is visible.
 */
Given('I am viewing account details for a manual account', () => {
  log('step', 'Starting default manual account (West London, Adult or youth)');
  flow().startFineAccount('West London', 'Adult or youth');
});

/**
 * Opens a task from the account details list.
 */
When('I view the {string} task from account details', (taskName: ManualAccountTaskName) => {
  log('navigate', 'Opening task from account details', { taskName });
  nav().navigateToAccountDetails();
  details().openTask(taskName);
  if (taskName === 'Account comments and notes') {
    comments().assertHeader();
  }
});

/**
 * Asserts the status text for a task list item.
 */
Then('the {string} task status is {string}', (taskName: ManualAccountTaskName, expectedStatus: string) => {
  log('assert', 'Checking task status', { taskName, expectedStatus });
  details().assertTaskStatus(taskName, expectedStatus);
});

/**
 * Returns to account details task list from a manual account form.
 */
When('I return to account details', () => {
  log('navigate', 'Returning to account details');
  nav().returnToAccountDetails();
});

/**
 * Provides comments and notes then returns to the task list.
 */
When('I provide account comments {string} and notes {string}', (comment: string, note: string) => {
  log('step', 'Providing account comments and notes', { comment, note });
  flow().provideAccountCommentsAndNotes(comment, note);
});

/**
 * Asserts the Account comments and notes fields contain the expected text.
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
 * Cancels out of account comments with a specific choice (stay/leave).
 */
When(
  'I choose {string} on the unsaved changes prompt for account comments',
  (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
    log('cancel', 'Cancelling from comments page', { choice });
    comments().cancelAndChoose(choice);
  },
);

/**
 * Proceeds from comments and notes to review and asserts the destination header.
 */
Then('I proceed to review account details from comments and notes and see the header {string}', (header: string) => {
  log('flow', 'Proceeding to review from comments and notes', { header });
  flow().proceedToReviewFromComments(header);
});

/**
 * Refreshes the current page.
 */
When('I refresh the application', () => {
  log('navigate', 'Refreshing the page');
  cy.reload();
});

/**
 * Completes court details and remains on the form (navigation handled by caller).
 */
When(
  'I complete manual court details with LJA {string}, PCR {string}, enforcement court {string}',
  (lja: string, pcr: string, enforcementCourt: string) => {
    log('step', 'Completing court details', { lja, pcr, enforcementCourt });
    details().assertOnAccountDetailsPage();
    courtDetails().fillCourtDetails(lja, pcr, enforcementCourt);
  },
);

When('I have provided manual court details from account details:', (table: DataTable) => {
  const data = table.rowsHash();
  log('step', 'Providing court details from table', data);
  nav().navigateToAccountDetails();
  details().openTask('Court details');
  courtDetails().fillCourtDetails(data['LJA'], data['PCR'], data['enforcement court']);
});

/**
 * Completes minimum personal details fields.
 */
When(
  'I complete manual personal details with title {string}, first names {string}, last name {string}, address line 1 {string}',
  (title: string, firstNames: string, lastName: string, addressLine1: string) => {
    log('step', 'Completing personal details', { title, firstNames, lastName, addressLine1 });
    details().assertOnAccountDetailsPage();
    personalDetails().fillBasicDetails({ title, firstNames, lastName, addressLine1 });
  },
);

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
 * Adds a single offence with imposition amounts.
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

When('I have provided offence details from account details:', (table: DataTable) => {
  const data = table.rowsHash();
  const offenceDate = resolveRelativeDate(data['offence date']);
  log('step', 'Providing offence details from table', { ...data, offenceDate });
  nav().navigateToAccountDetails();
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
 * Sends offence details for review.
 */
When('I submit the offence details for review', () => {
  log('navigate', 'Submitting offence details for review');
  offenceDetails().clickReviewOffence();
});

/**
 * Sets payment terms including collection order and pay-by date.
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

When('I have provided manual payment terms from account details:', (table: DataTable) => {
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
 * Confirms we are on the account details task list.
 */
Then('I am viewing account details', () => {
  log('assert', 'Asserting Account details header');
  details().assertOnAccountDetailsPage();
});

/**
 * Asserts multiple task statuses using a table.
 */
Then('the task statuses are:', (table: DataTable) => {
  nav().navigateToAccountDetails();
  table.rows().forEach(([task, status]) => {
    log('assert', 'Checking task status from table', { task, status });
    details().assertTaskStatus(task as ManualAccountTaskName, status);
  });
});

/**
 * Asserts both comment and note fields at once.
 */
Then('the manual account comment and note fields show {string} and {string}', (commentText: string, noteText: string) => {
  log('assert', 'Verifying comment and note fields', { commentText, noteText });
  comments().assertCommentValue(commentText);
  comments().assertNoteValue(noteText);
});
/**
 * Opens the Account comments and notes task without navigating (assumes we are already on Account details).
 */
When('I open the Account comments and notes task', () => {
  log('navigate', 'Opening Account comments and notes task (no navigation)');
  details().openTask('Account comments and notes');
  comments().assertHeader();
});
