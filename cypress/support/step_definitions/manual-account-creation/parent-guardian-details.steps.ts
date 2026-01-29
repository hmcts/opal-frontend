/**
 * @file parent-guardian-details.steps.ts
 * @description
 * Cucumber steps for Manual Account Creation **Parent or guardian details** task.
 *
 * @remarks
 * - Steps delegate to flow/actions; no direct selectors are used here.
 * - DataTables are normalised and logged to keep payloads explicit.
 */
import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualAccountCreationFlow } from '../../../e2e/functional/opal/flows/manual-account-creation.flow';
import {
  ManualParentGuardianDetailsPayload,
  ManualParentGuardianFieldKey,
} from '../../../e2e/functional/opal/actions/manual-account-creation/parent-guardian-details.actions';
import { log } from '../../utils/log.helper';
import { normalizeHash, normalizeTableRows } from '../../utils/cucumberHelpers';
import { calculateDOB } from '../../utils/dateUtils';

type ParentGuardianExpectationPayload = ManualParentGuardianDetailsPayload & {
  addAliasesChecked?: boolean;
};

const flow = (): ManualAccountCreationFlow => new ManualAccountCreationFlow();

const toBoolean = (value: string | undefined): boolean => /^(true|yes|y|1|checked)$/i.test(String(value ?? '').trim());

const resolveFieldKey = (label: string): ManualParentGuardianFieldKey => {
  const normalized = label.toLowerCase().replace(/\s+/g, '');
  switch (normalized) {
    case 'firstnames':
      return 'firstNames';
    case 'lastname':
      return 'lastName';
    case 'dateofbirth':
    case 'dob':
      return 'dob';
    case 'nationalinsurancenumber':
    case 'nin':
      return 'nationalInsuranceNumber';
    case 'addressline1':
      return 'addressLine1';
    case 'addressline2':
      return 'addressLine2';
    case 'addressline3':
      return 'addressLine3';
    case 'postcode':
      return 'postcode';
    case 'vehiclemake':
      return 'vehicleMake';
    case 'vehicleregistration':
    case 'registrationnumber':
      return 'vehicleRegistration';
    default:
      throw new Error(`Unsupported parent/guardian field label: ${label}`);
  }
};

const ensureAliasEntry = (
  payload: ManualParentGuardianDetailsPayload,
  index: number,
): NonNullable<ManualParentGuardianDetailsPayload['aliases']>[number] => {
  if (!payload.aliases) {
    payload.aliases = [];
  }

  while (payload.aliases.length <= index) {
    payload.aliases.push({});
  }

  return payload.aliases[index] ?? {};
};

const parseParentGuardianTable = (table: DataTable, mode: 'fill' | 'assert'): ParentGuardianExpectationPayload => {
  const raw = normalizeHash(table);
  const payload: ParentGuardianExpectationPayload = {};

  Object.entries(raw).forEach(([rawKey, rawValue]) => {
    const key = rawKey.trim();
    const value = (rawValue ?? '').toString().trim();

    if (!key) {
      return;
    }

    const aliasMatch = key.match(/^alias\s*(\d+)\.(.+)$/i);
    if (aliasMatch) {
      const aliasIndex = Number(aliasMatch[1]) - 1;
      const aliasField = aliasMatch[2].trim().toLowerCase();
      const aliases = payload.aliases ?? (payload.aliases = []);
      const target = ensureAliasEntry(payload, aliasIndex);

      if (aliasField.startsWith('first')) {
        target.firstNames = value;
      } else if (aliasField.startsWith('last')) {
        target.lastName = value;
      } else {
        throw new Error(`Unsupported alias field "${aliasField}" in key "${key}"`);
      }

      aliases[aliasIndex] = target;
      return;
    }

    if (key.toLowerCase() === 'addaliases' || key.toLowerCase() === 'addaliaseschecked') {
      if (mode === 'assert') {
        payload.addAliasesChecked = toBoolean(value);
      } else {
        payload.addAliases = toBoolean(value);
      }
      return;
    }

    if (key.toLowerCase() === 'dobyearsago') {
      payload.dob = calculateDOB(Number(value));
      return;
    }

    const fieldKey = resolveFieldKey(key);
    payload[fieldKey] = value;
  });

  if (payload.aliases?.length && payload.addAliases === undefined && payload.addAliasesChecked === undefined) {
    if (mode === 'assert') {
      payload.addAliasesChecked = true;
    } else {
      payload.addAliases = true;
    }
  }

  log('debug', 'Mapped Parent/Guardian table', { mode, raw, payload });

  if (!Object.keys(raw).length) {
    throw new Error('Parent/Guardian DataTable is empty after normalization');
  }

  return payload;
};

/**
 * @step Completes the Parent/Guardian details form using a DataTable payload.
 * @description Normalises the table to a payload, logs it, and fills the form.
 * @param table - Field/value pairs for the form.
 * @example
 *  When I complete parent or guardian details:
 *    | firstNames          | FNAME       |
 *    | lastName            | LNAME       |
 *    | addAliases          | true        |
 *    | alias1.firstNames   | ALIAS FN    |
 *    | alias1.lastName     | ALIAS LN    |
 */
When('I complete parent or guardian details:', (table: DataTable) => {
  const payload = parseParentGuardianTable(table, 'fill');
  log('step', 'Completing Parent/Guardian details', { payload });
  flow().fillParentGuardianDetails(payload);
});

/**
 * @step Asserts Parent/Guardian details match the provided DataTable.
 * @description Normalises the table, logs the expected values, and asserts each field.
 * @param table - Field/value pairs to assert.
 * @example
 *  Then I see parent or guardian details populated:
 *    | firstNames          | FNAME       |
 *    | addAliasesChecked   | true        |
 */
Then('I see parent or guardian details populated:', (table: DataTable) => {
  const expected = parseParentGuardianTable(table, 'assert');
  log('assert', 'Asserting Parent/Guardian details', { expected });
  flow().assertParentGuardianDetails(expected);
});

/**
 * @step Returns to Account details from the Parent/Guardian task.
 * @description Clicks Return to account details and asserts the task list is visible.
 * @example
 *  When I return to account details from parent or guardian details
 */
When('I return to account details from parent or guardian details', () => {
  log('navigate', 'Returning to Account details from Parent/Guardian task');
  flow().returnToAccountDetailsFromParentGuardian();
});

/**
 * @step Attempts to submit Parent/Guardian details without asserting navigation.
 * @description Clicks Return to account details and leaves validation/navigation checks to the caller.
 * @example
 *  When I attempt to return to account details from parent or guardian details
 */
When('I attempt to return to account details from parent or guardian details', () => {
  log('navigate', 'Submitting Parent/Guardian without navigation assertion');
  flow().submitParentGuardianWithoutNavigation();
});

/**
 * @step Continues to Contact details using the nested CTA on Parent/Guardian.
 * @description Clicks Add contact details and asserts the contact page header.
 * @example
 *  When I continue to parent or guardian contact details
 */
When('I continue to parent or guardian contact details', () => {
  log('navigate', 'Continuing to Contact details from Parent/Guardian');
  flow().continueToContactDetailsFromParentGuardian('Parent or guardian contact details');
});

/**
 * @step Cancels out of the Parent/Guardian task with a chosen dialog response.
 * @description Triggers Cancel and chooses whether to leave or stay on the page.
 * @param choice - "Ok" to leave, "Cancel" to stay.
 * @example
 *  When I cancel parent or guardian details choosing "Ok"
 */
When('I cancel parent or guardian details choosing {string}', (choice: 'Ok' | 'Cancel') => {
  log('cancel', 'Cancelling Parent/Guardian details', { choice });
  flow().cancelParentGuardianDetails(choice);
});

/**
 * @step Clears a specific Parent/Guardian field.
 * @description Clears the target field by setting it to an empty string.
 * @param label - Human-friendly field label (e.g., "First names").
 * @example
 *  Then I clear the parent or guardian "First names" field
 */
Then('I clear the parent or guardian {string} field', (label: string) => {
  const fieldKey = resolveFieldKey(label);
  log('clear', 'Clearing Parent/Guardian field', { label, fieldKey });
  flow().fillParentGuardianDetails({ [fieldKey]: '' });
});

/**
 * @step Clears multiple Parent/Guardian fields from a table list.
 * @description Accepts a table of field labels and clears each field in one pass.
 * @param table - Single-column table with field labels (header optional).
 * @example
 *  And I clear the following parent or guardian fields:
 *    | Field       |
 *    | First names |
 */
Then('I clear the following parent or guardian fields:', (table: DataTable) => {
  const rows = normalizeTableRows(table)
    .map((row) => row[0])
    .filter(Boolean);
  const labels = rows[0] && /^field$/i.test(rows[0]) ? rows.slice(1) : rows;

  if (!labels.length) {
    throw new Error('No parent/guardian fields provided to clear');
  }

  const payload: Partial<Record<ManualParentGuardianFieldKey, string>> = {};

  labels.forEach((label) => {
    const fieldKey = resolveFieldKey(label);
    payload[fieldKey] = '';
  });

  log('clear', 'Clearing Parent/Guardian fields', { labels, payload });
  flow().fillParentGuardianDetails(payload);
});

/**
 * @step Asserts an inline error message for a Parent/Guardian field.
 * @description Verifies the inline validation message above a specific field.
 * @param label - Field label to target.
 * @param message - Expected error text.
 * @example
 *  Then I see the parent or guardian "First names" error "Enter parent or guardian's first name(s)"
 */
Then('I see the parent or guardian {string} error {string}', (label: string, message: string) => {
  const fieldKey = resolveFieldKey(label);
  log('assert', 'Asserting Parent/Guardian inline error', { label, fieldKey, message });
  flow().assertParentGuardianInlineError(fieldKey, message);
});
