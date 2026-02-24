/**
 * @file dashboard.actions.ts
 * Provides reusable Cypress actions and assertions for interacting with the Opal Dashboard.
 * Covers dashboard verification and navigation to common areas such as Manual Account Creation
 * and Search for an Account.
 */

import { DashboardLocators as L } from '../../../../shared/selectors/dashboard.locators';
import { CreateManageDraftsLocators as CAM } from '../../../../shared/selectors/create-manage-drafts.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';

const log = createScopedLogger('DashboardActions');

/** Actions and assertions for the Opal dashboard landing page. */
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
        .invoke('text')
        .should((text) => {
          expect(text.trim().toLowerCase()).to.contain(username.toLowerCase());
        })
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

    cy.get('body', { timeout: 10_000 }).then(($body) => {
      const hasDirectMacLink = $body.find(L.manualAccountCreationLink).length > 0;

      if (hasDirectMacLink) {
        cy.get(L.manualAccountCreationLink, { timeout: 10_000 }).should('be.visible').click({ force: true });
        return;
      }

      log('navigate', 'Direct Manual Account Creation link not present, using Create and Manage Draft Accounts path');
      cy.get(L.createAndManageDraftAccountsLink, { timeout: 10_000 }).should('be.visible').click({ force: true });
      cy.get(CAM.createAccountButton, { timeout: 10_000 }).should('be.visible').click({ force: true });
    });

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

  /**
   * Navigates from the Dashboard to the "Consolidate accounts" page.
   *
   * Steps performed:
   *  1. Clicks the Consolidate accounts link in the dashboard.
   *  2. Waits for the URL to include `/fines/consolidation/select-business-unit`.
   *  3. Asserts that the consolidation heading is rendered.
   *
   * @example
   *   dashboard.goToConsolidation();
   */
  public goToConsolidation(): void {
    log('navigate', 'Navigating to Consolidate accounts');

    cy.get(L.consolidateAccountsLink, { timeout: 10_000 }).should('be.visible').click({ force: true });

    log('assert', 'Verifying Consolidate accounts page URL');
    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/consolidation/select-business-unit');

    log('assert', 'Ensuring consolidation heading is visible');
    cy.get('h1.govuk-heading-l', { timeout: 10_000 }).should('contain.text', 'Consolidate accounts');

    log('done', 'Successfully navigated to Consolidate accounts page');
  }

  /**
   * Navigates to the Create and Manage Draft Accounts area for inputters.
   *
   * @example
   *   dashboard.goToCreateAndManageDraftAccounts();
   */
  public goToCreateAndManageDraftAccounts(): void {
    log('navigate', 'Opening Create and Manage Draft Accounts');
    cy.get(L.createAndManageDraftAccountsLink, { timeout: 10_000 }).should('be.visible').click({ force: true });
  }

  /**
   * Navigates to the Check and Validate Draft Accounts area for checkers.
   *
   * @example
   *   dashboard.goToCheckAndValidateDraftAccounts();
   */
  public goToCheckAndValidateDraftAccounts(): void {
    log('navigate', 'Opening Check and Validate Draft Accounts');
    cy.get(L.checkAndValidateDraftAccountsLink, { timeout: 10_000 }).should('be.visible').click({ force: true });
  }
}
