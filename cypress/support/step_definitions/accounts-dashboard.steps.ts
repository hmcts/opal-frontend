/**
 * @file accounts-dashboard.steps.ts
 * @description
 * Step definitions for accounts navigation within the Opal application.
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

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ManualCreateAccountActions } from '../../e2e/functional/opal/actions/manual-account-creation/create-account.actions';
import { AccountSearchIndividualsActions } from '../../e2e/functional/opal/actions/search/search.individuals.actions';
import { ConsolidationActions } from '../../e2e/functional/opal/actions/consolidation/consolidation.actions';
import { PrimaryNavigationActions } from '../../e2e/functional/opal/actions/primary-navigation.actions';
import { log } from '../utils/log.helper';

const createAccount = () => new ManualCreateAccountActions();
const searchIndividuals = () => new AccountSearchIndividualsActions();
const consolidation = () => new ConsolidationActions();
const primaryNavigation = () => new PrimaryNavigationActions();

/**
 * @step Opens the **Manual Account Creation** page via the dashboard.
 *
 * @details
 * - Asserts the dashboard landing is ready, navigates to Accounts, and then calls
 *   `ManualCreateAccountActions.openFromAccountsPage()`.
 * - Typically used at the start of scenarios that create new accounts.
 *
 * @example
 * ```gherkin
 * When I open Manual Account Creation
 * ```
 */
When('I open Manual Account Creation', () => {
  primaryNavigation().assertDashboardLandingReady();
  primaryNavigation().chooseItem('Accounts');
  primaryNavigation().assertLandingPage('Accounts', '/fines/dashboard/accounts');
  createAccount().openFromAccountsPage();
});

/**
 * @step Opens the **Search for an Account** page via the dashboard.
 *
 * @details
 * - Asserts the dashboard landing is ready.
 * - Navigates to Search and verifies the Search page is displayed.
 */
When('I open Search for an Account', () => {
  primaryNavigation().assertDashboardLandingReady();
  primaryNavigation().chooseItem('Search');
  searchIndividuals().assertOnSearchLandingPage();
});

/**
 * @step Opens the **Consolidate accounts** page via the dashboard.
 *
 * @details
 * - Asserts the dashboard landing is ready, navigates to Accounts, and then calls
 *   `ConsolidationActions.openFromAccountsPage()`.
 *
 * @example
 * ```gherkin
 * When I open Consolidate accounts
 * ```
 */
When('I open Consolidate accounts', () => {
  primaryNavigation().assertDashboardLandingReady();
  primaryNavigation().chooseItem('Accounts');
  primaryNavigation().assertLandingPage('Accounts', '/fines/dashboard/accounts');
  consolidation().openFromAccountsPage();
});

Then('I should not see the Consolidate accounts link on the Accounts dashboard', () => {
  log('assert', 'Checking Consolidate accounts is hidden on the Accounts dashboard');
  consolidation().assertLinkHiddenOnAccountsPage();
});

When('I navigate directly to the Consolidate accounts page', () => {
  log('step', 'Navigating directly to the Consolidate accounts page');
  consolidation().visitPageDirectly();
});
