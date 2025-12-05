/**
 * @file personal-details.steps.ts
 * @description NewStyle step definitions for Manual Account Creation Personal details.
 */
import { When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { ManualAccountCreationFlow } from '../../../../e2e/functional/opal/flows/manual-account-creation.flow';
import {
  ManualPersonalDetailsActions,
  ManualPersonalDetailsFieldKey,
  ManualPersonalDetailsPayload,
} from '../../../../e2e/functional/opal/actions/manual-account-creation/personal-details.actions';
import { log } from '../../../utils/log.helper';
import { normalizeHash, normalizeTableRows } from '../../../utils/cucumberHelpers';
import { resolvePersonalDetailsFieldKey } from '../../../utils/macFieldResolvers';

const flow = () => new ManualAccountCreationFlow();
const actions = () => new ManualPersonalDetailsActions();

const mapPersonalDetailsPayload = (table: DataTable): ManualPersonalDetailsPayload => {
  const normalized = normalizeHash(table);
  const payload: ManualPersonalDetailsPayload = {};

  Object.entries(normalized).forEach(([label, value]) => {
    const fieldKey = resolvePersonalDetailsFieldKey(label);
    payload[fieldKey] = value;
  });

  return payload;
};

const toExpectationValue = (value?: string): string => {
  const normalized = (value ?? '').trim();
  if (normalized === '' || /not selected|not provided/i.test(normalized)) {
    return '';
  }
  return normalized;
};

const mapPersonalDetailsExpectations = (table: DataTable): Partial<Record<ManualPersonalDetailsFieldKey, string>> => {
  const normalized = normalizeHash(table);
  const expectations: Partial<Record<ManualPersonalDetailsFieldKey, string>> = {};

  Object.entries(normalized).forEach(([label, value]) => {
    const fieldKey = resolvePersonalDetailsFieldKey(label);
    expectations[fieldKey] = toExpectationValue(value);
  });

  return expectations;
};

/**
 * @step Provides personal details from Account details using a data table.
 * @description Opens the Personal details task, asserts the header, and completes required fields.
 * @example
 *   When I provide manual personal details from account details:
 *     | title        | Mr        |
 *     | first names  | Firstname |
 *     | last name    | Lastname  |
 *     | address line 1 | Address line 1 |
 */
When('I provide manual personal details from account details:', (table: DataTable) => {
  const payload = mapPersonalDetailsPayload(table);
  log('step', 'Providing personal details from Account details via table', { payload });
  flow().providePersonalDetailsFromAccountDetails(payload);
});

/**
 * @step Completes the Personal details form while already on the page.
 * @description Fills provided fields without handling navigation.
 */
When('I complete manual personal details:', (table: DataTable) => {
  const payload = mapPersonalDetailsPayload(table);
  log('step', 'Completing personal details on task', { payload });
  flow().completePersonalDetails(payload);
});

/**
 * @step Asserts personal details fields against expected values.
 * @description Uses a table of field/value pairs to validate the form state.
 */
Then('the manual personal details fields are:', (table: DataTable) => {
  const expected = mapPersonalDetailsExpectations(table);
  log('assert', 'Asserting personal details fields', { expected });
  flow().assertPersonalDetailsFields(expected);
});

/**
 * @step Cancels out of the Personal details form with a chosen dialog response.
 * @description Triggers Cancel and selects whether to stay or leave.
 */
When('I cancel manual personal details choosing {string}', (choice: 'Cancel' | 'Ok' | 'Stay' | 'Leave') => {
  log('cancel', 'Cancelling personal details with confirm choice', { choice });
  actions().cancelAndChoose(choice);
});

/**
 * @step Continues from Personal details to Contact details via the nested CTA.
 * @description Clicks the Add contact details button and guards the destination header.
 */
When('I continue to contact details from personal details', () => {
  log('navigate', 'Continuing to Contact details from Personal details');
  flow().continueToContactDetailsFromPersonalDetails('Defendant contact details');
});

/**
 * @step Clears multiple Personal details fields using a table.
 * @description Accepts a single-column table of field labels (header optional) and clears each field.
 */
When('I clear the following personal details fields:', (table: DataTable) => {
  const rows = normalizeTableRows(table)
    .map((row) => row[0])
    .filter(Boolean);
  const labels = rows[0] && /^field$/i.test(rows[0]) ? rows.slice(1) : rows;

  if (!labels.length) {
    throw new Error('No personal details fields provided to clear');
  }

  const fields = labels.map((label) => resolvePersonalDetailsFieldKey(label));

  log('clear', 'Clearing personal details fields', { labels, fields });
  actions().assertOnPersonalDetailsPage();
  actions().clearFields(fields);
});
