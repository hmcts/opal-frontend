/**
 * @file payment-terms.steps.ts
 * @description NewStyle step definitions for Manual Account Creation Payment terms.
 */
import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualAccountCreationFlow } from '../../../../e2e/functional/opal/flows/manual-account-creation.flow';
import {
  EnforcementActionOption,
  ManualPaymentTermsExpectations,
  ManualPaymentTermsInput,
  PaymentFrequencyOption,
  PaymentTermOption,
} from '../../../../e2e/functional/opal/actions/manual-account-creation/payment-terms.actions';
import { normalizeHash } from '../../../utils/cucumberHelpers';
import { resolveRelativeDate } from '../../../utils/dateUtils';
import { log } from '../../../utils/log.helper';

const flow = () => new ManualAccountCreationFlow();

const normalizeTable = (table: DataTable): Record<string, string> =>
  Object.fromEntries(Object.entries(normalizeHash(table)).map(([key, value]) => [key.toLowerCase(), value]));

const toBoolean = (value?: string): boolean | undefined => {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === '') {
    return undefined;
  }
  if (['yes', 'y', 'true', 'checked', 'selected'].includes(normalized)) {
    return true;
  }
  if (['no', 'n', 'false', 'unchecked', 'not selected'].includes(normalized)) {
    return false;
  }
  throw new Error(`Unsupported boolean value "${value}" for payment terms table`);
};

const resolveDateValue = (value?: string): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed === '') {
    return '';
  }
  if (/week/i.test(trimmed)) {
    return resolveRelativeDate(trimmed);
  }
  return trimmed;
};

const mapPaymentTerm = (value?: string): PaymentTermOption | undefined => {
  if (!value) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === '') {
    return undefined;
  }
  if (/pay in full/i.test(normalized)) {
    return 'Pay in full';
  }
  if (/instalments only/i.test(normalized)) {
    return 'Instalments only';
  }
  if (/lump sum plus instalments/i.test(normalized)) {
    return 'Lump sum plus instalments';
  }
  throw new Error(`Unknown payment term option: ${value}`);
};

const mapFrequency = (value?: string): PaymentFrequencyOption | undefined => {
  if (!value) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === '') {
    return undefined;
  }
  if (/weekly/i.test(normalized)) {
    return 'Weekly';
  }
  if (/fortnightly/i.test(normalized)) {
    return 'Fortnightly';
  }
  if (/monthly/i.test(normalized)) {
    return 'Monthly';
  }
  throw new Error(`Unknown payment frequency option: ${value}`);
};

const mapEnforcementOption = (value?: string): EnforcementActionOption | undefined => {
  if (!value) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === '') {
    return undefined;
  }
  if (/noenf|hold enforcement/i.test(normalized)) {
    return 'Hold enforcement on account (NOENF)';
  }
  if (/prison|pris/i.test(normalized)) {
    return 'Prison (PRIS)';
  }
  throw new Error(`Unknown enforcement option: ${value}`);
};

const mapPaymentTermsPayload = (table: DataTable, defaultPaymentTerm?: PaymentTermOption): ManualPaymentTermsInput => {
  const rows = normalizeTable(table);
  const collectionOrder = rows['collection order'];
  const payload: ManualPaymentTermsInput = {};

  if (collectionOrder) {
    const normalized = collectionOrder.trim().toLowerCase();
    if (!['yes', 'no'].includes(normalized)) {
      throw new Error(`Unsupported collection order "${collectionOrder}"`);
    }
    payload.collectionOrder = (normalized === 'yes' ? 'Yes' : 'No') as 'Yes' | 'No';
  }

  const collectionOrderToday = toBoolean(rows['make collection order today']);
  if (collectionOrderToday !== undefined) {
    payload.collectionOrderToday = collectionOrderToday;
  }

  const collectionOrderDate = resolveDateValue(rows['collection order date']);
  if (collectionOrderDate !== undefined) {
    payload.collectionOrderDate = collectionOrderDate;
  }

  const paymentTerm = mapPaymentTerm(rows['payment term'] ?? rows['payment terms'] ?? defaultPaymentTerm);
  if (paymentTerm) {
    payload.paymentTerm = paymentTerm;
  }

  const payByDate = resolveDateValue(rows['pay in full by']);
  if (payByDate !== undefined) {
    payload.payByDate = payByDate;
  }

  const lumpSum = rows['lump sum'] ?? rows['lump sum amount'];
  if (lumpSum !== undefined) {
    payload.lumpSumAmount = lumpSum;
  }

  const instalment = rows['instalment'] ?? rows['instalment amount'];
  if (instalment !== undefined) {
    payload.instalmentAmount = instalment;
  }

  const frequency = mapFrequency(rows['payment frequency'] ?? rows['frequency']);
  if (frequency) {
    payload.frequency = frequency;
  }

  const startDate = resolveDateValue(rows['start date']);
  if (startDate !== undefined) {
    payload.startDate = startDate;
  }

  const requestPaymentCard = toBoolean(rows['request payment card']);
  if (requestPaymentCard !== undefined) {
    payload.requestPaymentCard = requestPaymentCard;
  }

  const daysInDefault = toBoolean(
    rows['days in default'] ?? rows['there are days in default'] ?? rows['has days in default'],
  );
  if (daysInDefault !== undefined) {
    payload.hasDaysInDefault = daysInDefault;
  }

  const daysInDefaultDate = resolveDateValue(
    rows['days in default imposed'] ?? rows['date days in default were imposed'],
  );
  if (daysInDefaultDate !== undefined) {
    payload.daysInDefaultDate = daysInDefaultDate;
  }

  const defaultDays = rows['default days'] ?? rows['days in default input field'] ?? rows['days in default count'];
  if (defaultDays !== undefined) {
    payload.defaultDays = defaultDays;
  }

  const addEnforcementAction = toBoolean(rows['add enforcement action']);
  if (addEnforcementAction !== undefined) {
    payload.addEnforcementAction = addEnforcementAction;
  }

  const enforcementOption = mapEnforcementOption(rows['enforcement action'] ?? rows['enforcement action option']);
  if (enforcementOption) {
    payload.enforcementOption = enforcementOption;
  }

  const enforcementReason = rows['enforcement reason'] ?? rows['reason account is on noenf'] ?? rows['reason'];
  if (enforcementReason !== undefined) {
    payload.enforcementReason = enforcementReason;
  }

  return payload;
};

const mapCollectionOrderExpectation = (value?: string): ManualPaymentTermsExpectations['collectionOrder'] => {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === '') {
    return undefined;
  }
  if (normalized === 'not selected' || normalized === 'none') {
    return 'Not selected';
  }
  if (normalized === 'yes' || normalized === 'no') {
    return (normalized.charAt(0).toUpperCase() + normalized.slice(1)) as 'Yes' | 'No';
  }
  throw new Error(`Unsupported collection order expectation "${value}"`);
};

const mapPaymentTermsExpectations = (table: DataTable): ManualPaymentTermsExpectations => {
  const rows = normalizeTable(table);
  const expected: ManualPaymentTermsExpectations = {};

  expected.collectionOrder = mapCollectionOrderExpectation(rows['collection order']);

  const collectionOrderToday = toBoolean(rows['make collection order today']);
  if (collectionOrderToday !== undefined) {
    expected.collectionOrderToday = collectionOrderToday;
  }

  const collectionOrderDate = resolveDateValue(rows['collection order date']);
  if (collectionOrderDate !== undefined) {
    expected.collectionOrderDate = collectionOrderDate;
  }

  const paymentTerm = rows['payment term'] ?? rows['payment terms'];
  if (paymentTerm !== undefined) {
    expected.paymentTerm =
      paymentTerm.trim().toLowerCase() === 'not selected' ? 'Not selected' : mapPaymentTerm(paymentTerm);
  }

  const payByDate = resolveDateValue(rows['pay in full by']);
  if (payByDate !== undefined) {
    expected.payByDate = payByDate;
  }

  const lumpSum = rows['lump sum'] ?? rows['lump sum amount'];
  if (lumpSum !== undefined) {
    expected.lumpSumAmount = lumpSum;
  }

  const instalment = rows['instalment'] ?? rows['instalment amount'];
  if (instalment !== undefined) {
    expected.instalmentAmount = instalment;
  }

  const frequency = rows['payment frequency'] ?? rows['frequency'];
  if (frequency !== undefined) {
    expected.frequency = frequency.trim().toLowerCase() === 'not selected' ? 'Not selected' : mapFrequency(frequency);
  }

  const startDate = resolveDateValue(rows['start date']);
  if (startDate !== undefined) {
    expected.startDate = startDate;
  }

  const requestPaymentCard = toBoolean(rows['request payment card']);
  if (requestPaymentCard !== undefined) {
    expected.requestPaymentCard = requestPaymentCard;
  }

  const daysInDefault = toBoolean(
    rows['days in default'] ?? rows['there are days in default'] ?? rows['has days in default'],
  );
  if (daysInDefault !== undefined) {
    expected.hasDaysInDefault = daysInDefault;
  }

  const daysInDefaultDate = resolveDateValue(
    rows['days in default imposed'] ?? rows['date days in default were imposed'],
  );
  if (daysInDefaultDate !== undefined) {
    expected.daysInDefaultDate = daysInDefaultDate;
  }

  const defaultDays = rows['default days'] ?? rows['days in default input field'] ?? rows['days in default count'];
  if (defaultDays !== undefined) {
    expected.defaultDays = defaultDays;
  }

  const addEnforcementAction = toBoolean(rows['add enforcement action']);
  if (addEnforcementAction !== undefined) {
    expected.addEnforcementAction = addEnforcementAction;
  }

  const enforcementOption = rows['enforcement action'] ?? rows['enforcement action option'];
  if (enforcementOption !== undefined) {
    expected.enforcementOption =
      enforcementOption.trim().toLowerCase() === 'not selected'
        ? 'Not selected'
        : mapEnforcementOption(enforcementOption);
  }

  const enforcementReason = rows['enforcement reason'] ?? rows['reason account is on noenf'] ?? rows['reason'];
  if (enforcementReason !== undefined) {
    expected.enforcementReason = enforcementReason;
  }

  return expected;
};

/**
 * @step Completes payment terms on the current task.
 * @description Fills Payment terms fields using the provided data table.
 * @example
 *   When I complete manual payment terms:
 *     | payment term | Pay in full |
 */
When('I complete manual payment terms:', (table: DataTable) => {
  const payload = mapPaymentTermsPayload(table);
  log('step', 'Completing payment terms on task', { payload });
  flow().completePaymentTerms(payload);
});

/**
 * @step Provides payment terms by opening the task from Account details.
 * @description Navigates via Account details to Payment terms and fills values.
 * @example
 *   When I have provided manual payment terms:
 *     | collection order      | Yes                 |
 *     | collection order date | 2 weeks in the past |
 *     | pay in full by        | 3 weeks in the future |
 */
When('I have provided manual payment terms:', (table: DataTable) => {
  const payload = mapPaymentTermsPayload(table, 'Pay in full');
  log('step', 'Providing payment terms from Account details', { payload });
  flow().providePaymentTermsFromAccountDetails(payload);
});

/**
 * @step Asserts payment terms values on the task.
 * @description Verifies Payment terms selections and inputs using a table.
 * @example
 *   Then the manual payment terms fields are:
 *     | payment term | Pay in full |
 */
Then('the manual payment terms fields are:', (table: DataTable) => {
  const expected = mapPaymentTermsExpectations(table);
  log('assert', 'Asserting manual payment terms values', { expected });
  flow().assertPaymentTermsFields(expected);
});

/**
 * @step Cancels Payment terms and confirms leaving the page.
 * @description Triggers Cancel and accepts the confirm dialog, returning to Account details.
 * @example When I cancel manual payment terms choosing "Ok" and return to account details
 */
When('I cancel manual payment terms choosing {string} and return to account details', (choice: 'Ok' | 'Leave') => {
  if (!/ok|leave/i.test(choice)) {
    throw new Error('Use the non-returning cancel step for choices other than Ok/Leave.');
  }
  log('cancel', 'Cancelling Payment terms and returning to Account details', { choice });
  flow().cancelPaymentTermsAndReturn(choice);
});

/**
 * @step Cancels Payment terms and remains on the task.
 * @description Triggers Cancel and dismisses the confirm dialog to stay on Payment terms.
 * @example When I cancel manual payment terms choosing "Cancel"
 */
When('I cancel manual payment terms choosing {string}', (choice: 'Cancel' | 'Stay') => {
  if (!/cancel|stay/i.test(choice)) {
    throw new Error('Use the return-to-account-details cancel step for Ok/Leave choices.');
  }
  log('cancel', 'Cancelling Payment terms without leaving', { choice });
  flow().cancelPaymentTerms(choice);
});

/**
 * @step Proceeds from Payment terms to Account comments and notes.
 * @description Uses the nested CTA to open Account comments and notes and asserts navigation.
 * @example When I proceed to account comments from payment terms
 */
When('I proceed to account comments from payment terms', () => {
  log('navigate', 'Proceeding to Account comments and notes from Payment terms');
  flow().proceedToAccountCommentsFromPaymentTerms();
});
