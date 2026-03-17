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
   * Checks whether the current path is already the Manual Account Creation originator page.
   * @param pathname - Current browser pathname.
   * @returns True when already on originator/create-or-transfer step.
   */
  private isOnMacOriginatorPage(pathname: string): boolean {
    return pathname.includes('/originator-type') || pathname.includes('/create-or-transfer-in');
  }

  /**
   * Shared navigation routine for a specific dashboard route into Manual Account Creation.
   * Retries once with a page refresh before failing with a clear selector-specific error.
   * @param linkSelector - Dashboard selector to use for this route variant.
   * @param missingLinkMessage - Log message used when the route link is missing before refresh.
   * @param afterLinkClick - Optional callback for follow-up actions after clicking the route link.
   */
  private navigateToMac(linkSelector: string, missingLinkMessage: string, afterLinkClick?: () => void): void {
    const clickRoute = () => {
      cy.get(linkSelector, { timeout: 20_000 }).first().should('be.visible').click({ force: true });
      if (afterLinkClick) afterLinkClick();
    };

    const verifyAfterFailedRetry = () => {
      cy.location('pathname', { timeout: 10_000 }).then((pathname) => {
        if (this.isOnMacOriginatorPage(pathname)) {
          log('navigate', 'Dashboard link not visible after refresh, but already on originator page');
          return;
        }

        throw new Error(
          `Manual Account Creation navigation failed: "${linkSelector}" was not found on the dashboard after refresh ` +
            `(path: ${pathname}).`,
        );
      });
    };

    cy.location('pathname', { timeout: 10_000 })
      .then((pathname) => {
        if (this.isOnMacOriginatorPage(pathname)) {
          log('navigate', 'Already on the Manual Account Creation originator page');
          return;
        }

        cy.get('body', { timeout: 20_000 })
          .should('be.visible')
          .then(($body) => {
            if ($body.find(linkSelector).length) {
              clickRoute();
              return;
            }

            log('navigate', missingLinkMessage);
            cy.reload();

            cy.get('body', { timeout: 20_000 })
              .should('be.visible')
              .then(($bodyAfterRefresh) => {
                if ($bodyAfterRefresh.find(linkSelector).length) {
                  clickRoute();
                  return;
                }

                verifyAfterFailedRetry();
              });
          });
      })
      .then(() => {
        log('done', 'Navigated to Manual Account Creation page');
      });
  }

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
   * Navigates to Manual Account Creation via **Create and Manage Draft Accounts**.
   */
  public goToManualAccountCreation(): void {
    log('navigate', 'Opening Manual Account Creation using Create and Manage Draft Accounts route');
    this.navigateToMac(L.createAndManageDraftAccountsLink, 'Create and Manage Draft Accounts link not found', () => {
      cy.get(CAM.createAccountButton, { timeout: 20_000 }).should('be.visible').click({ force: true });
    });
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
