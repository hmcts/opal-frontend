/**
 * @file dashboard.steps.ts
 * @description
 * Step definitions for authenticated home-area navigation within the Opal application.
 * Covers high-level actions such as opening the Manual Account Creation page
 * or navigating to other dashboard-linked areas.
 *
 * These steps bridge Gherkin syntax (Cucumber) and Cypress Actions,
 * delegating actual behavior to destination-specific action classes.
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
 * @see {@link ManualCreateAccountActions}
 * @see {@link AccountSearchIndividualsActions}
 * @see {@link ConsolidationActions}
 */

import { When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualCreateAccountActions } from '../../e2e/functional/opal/actions/manual-account-creation/create-account.actions';
import { AccountSearchIndividualsActions } from '../../e2e/functional/opal/actions/search/search.individuals.actions';
import { ConsolidationActions } from '../../e2e/functional/opal/actions/consolidation/consolidation.actions';

const createAccount = () => new ManualCreateAccountActions();
const searchIndividuals = () => new AccountSearchIndividualsActions();
const consolidation = () => new ConsolidationActions();

/**
 * @step Opens the **Manual Account Creation** page via the dashboard.
 *
 * @details
 * - Calls `ManualCreateAccountActions.openFromAuthenticatedHome()` internally.
 * - Typically used at the start of scenarios that create new accounts.
 *
 * @example
 * ```gherkin
 * When I open Manual Account Creation
 * ```
 */
When('I open Manual Account Creation', () => {
  createAccount().openFromAuthenticatedHome();
});

/**
 * @step Opens the **Search for an Account** page via the dashboard.
 *
 * @details
 * - Calls `AccountSearchIndividualsActions.openSearchFromAuthenticatedHome()` internally.
 * - Useful for scenarios that need to land on Account Search from the dashboard.
 *
 * @example
 * ```gherkin
 * When I open Search for an Account
 * ```
 */
When('I open Search for an Account', () => {
  searchIndividuals().openSearchFromAuthenticatedHome();
});

/**
 * @step Opens the **Consolidate accounts** page via the dashboard.
 *
 * @details
 * - Calls `ConsolidationActions.openFromAuthenticatedHome()` internally.
 *
 * @example
 * ```gherkin
 * When I open Consolidate accounts
 * ```
 */
When('I open Consolidate accounts', () => {
  consolidation().openFromAuthenticatedHome();
});
