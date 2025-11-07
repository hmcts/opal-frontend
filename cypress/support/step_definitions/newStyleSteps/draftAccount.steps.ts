/**
 * @file draftAccount.steps.ts
 * @description
 * Step definitions for **draft account creation and status management** within Opal.
 *
 * These steps interface directly with API-level actions (not UI flows) to
 * quickly prepare test data for scenarios that depend on specific draft states.
 *
 * @remarks
 * - Uses the `createDraftAndSetStatus()` API helper to create a draft account
 *   and immediately update its status (e.g., "Submitted", "Approved").
 * - Designed for setup/background steps in Cucumber features.
 * - Avoids UI overhead by manipulating data via Cypress tasks or API routes.
 *
 * @example
 *   Given I create a "company" draft account with the following details and set status "Approved":
 *     | Name    | Example Ltd |
 *     | Address | 123 Test St |
 *
 * @see {@link createDraftAndSetStatus}
 */

import { Given } from '@badeball/cypress-cucumber-preprocessor';
import type { DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { createDraftAndSetStatus } from '../../../e2e/functional/opal/actions/draftAccount.api';

/**
 * @step Creates a draft account of the specified type using provided details,
 *       then updates its status.
 *
 * @param accountType - Type of account to create (`company`, `adultOrYouthOnly`, or `pgToPay`).
 * @param newStatus - The new status to set after creation (e.g., "Approved", "Submitted").
 * @param table - A Cucumber `DataTable` defining field/value pairs for draft creation.
 *
 * @details
 * - Delegates to the reusable `createDraftAndSetStatus()` action for API-level operations.
 * - Returns the underlying Cypress chain to ensure proper command sequencing.
 */
Given(
  'I create a {string} draft account with the following details and set status {string}:',
  (accountType: 'company' | 'adultOrYouthOnly' | 'pgToPay', newStatus: string, table: DataTable) => {
    return createDraftAndSetStatus(accountType, newStatus, table);
  },
);
