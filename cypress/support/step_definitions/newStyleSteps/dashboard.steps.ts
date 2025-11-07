/**
 * @file navigation.steps.ts
 * @description
 * Step definitions related to **navigation within the Opal application**,
 * particularly high-level dashboard and feature entry points.
 *
 * These steps map natural-language navigation actions in Cucumber
 * scenarios to executable Cypress commands that perform the equivalent UI navigation.
 *
 * @remarks
 * - The steps are intentionally minimal and delegate logic to **Action classes**.
 * - Logging can be extended later (e.g., `Cypress.log`) if additional navigation flows are added.
 *
 * @example
 *   When I open Manual Account Creation
 *
 * @see {@link goToManualAccountCreation}
 */

import { When } from '@badeball/cypress-cucumber-preprocessor';
import { goToManualAccountCreation } from '../../../e2e/functional/opal/actions/dashboard.actions';

/**
 * @step Opens the **Manual Account Creation** page via the dashboard.
 *
 * @details
 * - Uses the `goToManualAccountCreation()` action helper from `dashboard.actions`.
 * - This step is typically used at the start of test scenarios that validate
 *   account creation workflows.
 */
When('I open Manual Account Creation', () => {
  goToManualAccountCreation();
});
