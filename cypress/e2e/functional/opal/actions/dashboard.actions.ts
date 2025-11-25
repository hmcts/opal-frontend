/**
 * @fileoverview dashboard.actions.ts
 * Provides reusable Cypress actions and assertions for interacting with the Opal Dashboard.
 * Covers dashboard verification and navigation to common areas such as Manual Account Creation
 * and Search for an Account.
 */

import { DashboardLocators as L } from '../../../../shared/selectors/dashboard.locators';
import { log } from '../../../../support/utils/log.helper';

export class DashboardActions {
  /**
   * Asserts that the user is on the Dashboard page.
   *
   * Steps performed:
   *  1. Waits for the page title to contain "Dashboard".
   *  2. Optionally asserts that the displayed username matches the expected user.
   *
   * @param username - Optional username text to assert on.
   *
   * @example
   *   dashboard.assertDashboard('Test User');
   */
  public assertDashboard(username?: string): void {
    log('assert', 'Asserting Dashboard page is visible');

    cy.get(L.dashboardPageTitle, { timeout: 10_000 })
      .should('contain.text', 'Dashboard')
      .then(() => log('done', 'Dashboard title found'));

    if (username) {
      log('assert', `Asserting username: ${username}`);
      cy.get(L.userName, { timeout: 10_000 })
        .should('contain.text', username)
        .then(() => log('done', 'Username displayed correctly'));
    }
  }

  /**
   * Navigates to the Manual Account Creation page from the Dashboard.
   *
   * Steps performed:
   *  1. Clicks the "Manual Account Creation" link.
   *  2. Ensures the link is visible before interaction.
   *
   * @example
   *   dashboard.goToManualAccountCreation();
   */
  public goToManualAccountCreation(): void {
    log('navigate', 'Clicking Manual Account Creation link');

    cy.get(L.manualAccountCreationLink, { timeout: 10_000 }).should('be.visible').click({ force: true });

    log('done', 'Navigated to Manual Account Creation page');
  }

  /**
   * Navigates from the Dashboard to the "Search for an Account" page.
   *
   * Steps performed:
   *  1. Clicks the Search link in the dashboard.
   *  2. Waits for the URL to include `/fines/search-accounts/search`.
   *  3. Asserts that the search form component is rendered.
   *
   * @example
   *   dashboard.goToAccountSearch();
   */
  public goToAccountSearch(): void {
    log('navigate', 'Navigating to Search for an Account');

    cy.get('#finesSaSearchLink', { timeout: 10_000 }).should('be.visible').click({ force: true });

    log('assert', 'Verifying Search for an Account page URL');
    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/search-accounts/search');

    // Ensure the search form is rendered
    log('assert', 'Ensuring search form is visible');
    cy.get('app-fines-sa-search, [data-testid="fines-sa-search"]', { timeout: 10_000 }).should('be.visible');

    log('done', 'Successfully navigated to Search for an Account page');
  }
}
