/**
 * @file dashboard.steps.ts
 * @description
 * Step definitions for **Dashboard navigation** within the Opal application.
 * Covers high-level actions such as opening the Manual Account Creation page
 * or navigating to other dashboard-linked areas.
 *
 * These steps bridge Gherkin syntax (Cucumber) and Cypress Actions,
 * delegating actual behavior to the {@link DashboardActions} class.
 *
 * @remarks
 * - Steps remain intentionally lightweight to keep logic centralized in actions.
 * - Logs navigation events using `Cypress.log` for clear runner visibility.
 *
 * @example
 * ```gherkin
 * When I open Manual Account Creation
 * ```
 *
 * @see {@link DashboardActions}
 */

import { When } from '@badeball/cypress-cucumber-preprocessor';
import { DashboardActions } from '../../e2e/functional/opal/actions/dashboard.actions';

/**
 * Returns a new instance of {@link DashboardActions}.
 * This factory ensures that each step runs in isolation.
 * @returns Fresh DashboardActions instance for the invoking step.
 */
const dashboard = () => new DashboardActions();

/**
 * @step Opens the **Manual Account Creation** page via the dashboard.
 *
 * @details
 * - Calls {@link DashboardActions.goToManualAccountCreation} internally.
 * - Typically used at the start of scenarios that create new accounts.
 *
 * @example
 * ```gherkin
 * When I open Manual Account Creation
 * ```
 */
When('I open Manual Account Creation', () => {
  dashboard().goToManualAccountCreation();
});

/**
 * @step Opens the **Search for an Account** page via the dashboard.
 *
 * @details
 * - Calls {@link DashboardActions.goToAccountSearch} internally.
 * - Useful for scenarios that need to land on Account Search from the dashboard.
 *
 * @example
 * ```gherkin
 * When I open Search for an Account
 * ```
 */
When('I open Search for an Account', () => {
  dashboard().goToAccountSearch();
});
