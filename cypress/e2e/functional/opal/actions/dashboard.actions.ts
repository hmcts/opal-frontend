/**
 * @fileoverview DashboardActions
 * Provides reusable Cypress actions and assertions for interacting with the Opal Dashboard.
 * Covers dashboard verification and navigation to common areas such as Manual Account Creation
 * and Search for an Account.
 *
 * @module actions/dashboard.actions
 */

import { DashboardLocators as Locators } from '../../../../shared/selectors/dashboard.locators';

export class DashboardActions {
  /**
   * Asserts that the user is on the Dashboard page.
   *
   * Steps performed:
   *  1. Waits for the page title to contain "Dashboard".
   *  2. Optionally asserts that the displayed username matches the expected user.
   *
   * @param {string} [username] - Optional username text to assert on.
   *
   * @example
   *   dashboard.assertDashboard('Test User');
   */
  assertDashboard(username?: string): void {
    Cypress.log({ name: 'dashboard', message: 'Asserting Dashboard page is visible' });

    cy.get(Locators.dashboardPageTitle, { timeout: 10000 })
      .should('contain.text', 'Dashboard')
      .then(() => Cypress.log({ name: 'assert', message: 'Dashboard title found' }));

    if (username) {
      Cypress.log({ name: 'assert', message: `Asserting username: ${username}` });
      cy.get(Locators.userName, { timeout: 10000 })
        .should('contain.text', username)
        .then(() => Cypress.log({ name: 'assert', message: 'Username displayed correctly' }));
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
  goToManualAccountCreation(): void {
    Cypress.log({
      name: 'dashboard',
      displayName: 'Navigation',
      message: 'Clicking Manual Account Creation link',
    });

    cy.get(Locators.manualAccountCreationLink, { timeout: 10000 }).should('be.visible').click({ force: true });

    Cypress.log({ name: 'navigate', message: 'Navigated to Manual Account Creation page' });
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
  goToAccountSearch(): void {
    Cypress.log({ name: 'dashboard', displayName: 'Navigation', message: 'Navigating to Search For An Account' });

    cy.get('#finesSaSearchLink', { timeout: 10000 }).should('be.visible').click({ force: true });

    Cypress.log({ name: 'assert', message: 'Verifying Search for an Account page URL' });
    cy.location('pathname', { timeout: 10000 }).should('include', '/fines/search-accounts/search');

    // Ensure the search form is rendered
    Cypress.log({ name: 'assert', message: 'Ensuring search form is visible' });
    cy.get('app-fines-sa-search, [data-testid="fines-sa-search"]', { timeout: 10000 }).should('be.visible');

    Cypress.log({ name: 'done', message: 'Successfully navigated to Search for an Account page' });
  }
}
