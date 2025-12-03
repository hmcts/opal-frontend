/**
 * @file draftAccount.steps.ts
 * @description
 * Step definitions for creating draft accounts and setting their status.
 * Supports multiple Gherkin aliases that map to one underlying implementation,
 * keeping features readable while avoiding duplicate logic.
 *
 * @remarks
 * - These steps operate at the API level via Cypress tasks — no UI overhead.
 * - Use them in Background or setup stages to prepare predictable data states.
 * - Aliases allow both the explicit and implicit “Publishing Pending” forms.
 *
 * @example
 *   Given I create a "company" draft account with the following details and set status "Submitted":
 *     | account.defendant.company_name | Example Co Ltd |
 *     | account.account_type           | Fine           |
 *
 * @example
 *   And I create and publish an "adultOrYouthOnly" draft account with the following details:
 *     | account.defendant.forenames | John |
 *     | account.defendant.surname   | Smith |
 */

import { Given } from '@badeball/cypress-cucumber-preprocessor';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { createDraftAndSetStatus } from '../../../e2e/functional/opal/actions/draft-account.api';
import { log } from '../../utils/log.helper';

/**
 * @typedef AccountType
 * Union of all supported draft account types.
 */
type AccountType = 'company' | 'adultOrYouthOnly' | 'pgToPay';

/**
 * Unified implementation used by all step aliases.
 *
 * @param accountType - The type of account to create (`company`, `adultOrYouthOnly`, or `pgToPay`).
 * @param table - A Cucumber DataTable defining the account fields and values.
 * @param status - The target status after creation (defaults to "Publishing Pending").
 *
 * @returns Cypress.Chainable
 *
 * @remarks
 * - Writes Cypress logs for clear traceability in the test runner.
 * - Default behaviour simulates the “create and publish pending” lifecycle.
 */
function createDraftAndPrepareForPublishing(
  accountType: AccountType,
  table: DataTable,
  status: string = 'Publishing Pending',
) {
  const details = table.hashes?.() ?? [];

  log('step', `Creating ${accountType} draft → ${status}`, {
    accountType,
    status,
    fields: details,
    rowCount: details.length,
  });

  return createDraftAndSetStatus(accountType, status, table);
}

/**
 * @step Create a draft account, set explicit status, and persist.
 * @description
 *  Creates a draft account of the specified type, populates it with data from the
 *  provided Cucumber DataTable, and sets the draft's status before saving.
 *
 * @param accountType - The account type (e.g., "company" or "individual").
 * @param status - The target draft status to assign.
 * @param table - Cucumber DataTable containing field/value pairs for the draft account.
 *
 * @remarks
 *  - Uses the flow `createDraftAndPrepareForPublishing()` to perform all actions.
 *  - Utilizes `table.rows()` to safely extract the table data for logging.
 *
 * @example
 *  Given I create a "company" draft account with the following details and set status "Submitted":
 *    | account.defendant.company_name | Example Co |
 */
Given(
  'I create a {string} draft account with the following details and set status {string}:',
  (accountType: AccountType, status: string, table: DataTable) => {
    // Convert DataTable into raw row format for logging purposes.
    const data = table.rows();

    log('step', `Create ${accountType} draft, status ${status}`, { accountType, status, data });

    // Perform the draft creation and set the desired status.
    createDraftAndPrepareForPublishing(accountType, table, status);
  },
);

/**
 * Step alias #2 (implicit “Publishing Pending” status)
 *
 * @example
 * And I create and publish an "adultOrYouthOnly" draft account with the following details:
 *   | account.defendant.forenames | John |
 *   | account.defendant.surname   | Smith |
 */
Given(
  'I create and publish an {string} draft account with the following details:',
  (accountType: AccountType, table: DataTable) => createDraftAndPrepareForPublishing(accountType, table),
);
