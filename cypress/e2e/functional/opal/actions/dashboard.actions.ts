/**
 * @file dashboard.actions.ts
 * Provides reusable Cypress actions and assertions for interacting with the
 * authenticated Opal Fines home areas.
 *
 * The landing experience is now search-first for some journeys, so this helper
 * accepts the current home pages (`Search`, `Accounts`, legacy `Dashboard`)
 * and performs any required hand-off between those areas before navigating to
 * downstream journeys such as Manual Account Creation.
 */

import { DashboardLocators as L } from '../../../../shared/selectors/dashboard.locators';
import { PrimaryNavigationLocators as PN } from '../../../../shared/selectors/primary-navigation.locators';
import { CreateManageDraftsLocators as CAM } from '../../../../shared/selectors/create-manage-drafts.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { CommonActions } from './common/common.actions';

const log = createScopedLogger('DashboardActions');

/** Actions and assertions for the Opal dashboard landing page. */
export class DashboardActions {
  /** Shared common assertions/timeouts used across home-area navigation. */
  private readonly common = new CommonActions();

  /** Valid first-page headings immediately after authentication. */
  private readonly allowedHomePageHeaders = ['Dashboard', 'Search for an account', 'Accounts'] as const;

  /**
   * Checks whether the current path is already the Manual Account Creation originator page.
   * @param pathname - Current browser pathname.
   * @returns True when already on originator/create-or-transfer step.
   */
  private isOnMacOriginatorPage(pathname: string): boolean {
    return pathname.includes('/originator-type') || pathname.includes('/create-or-transfer-in');
  }

  /**
   * Moves to the Accounts landing page when the current journey starts on Search.
   * This keeps older dashboard-style helpers working after the search-first landing change.
   */
  private ensureAccountsLandingPage(): void {
    cy.location('pathname', { timeout: 10_000 }).then((pathname) => {
      if (pathname.includes('/fines/dashboard/accounts')) {
        return;
      }

      log('navigate', 'Switching to Accounts landing page');
      cy.contains(`${PN.container} .moj-primary-navigation__link`, 'Accounts', this.common.getTimeoutOptions())
        .should('be.visible')
        .click();

      cy.location('pathname', this.common.getPathTimeoutOptions()).should('include', '/fines/dashboard/accounts');
      this.common.assertHeaderContains('Accounts');
    });
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
   * Asserts that the user has landed on a valid authenticated home page.
   *
   * Steps performed:
   *  1. Finds the first visible page heading.
   *  2. Confirms the heading matches one of the allowed post-login home pages.
   *  3. Optionally asserts that the displayed username matches the expected user
   *     when the current page renders a username element.
   *
   * @param username - Optional username text to assert on when available.
   *
   * @example
   *   dashboard.assertDashboard();
   */
  public assertDashboard(username?: string): void {
    log('assert', 'Asserting home landing page is visible');

    cy.get('h1[class*="govuk-heading"], h1', { timeout: 10_000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .invoke('text')
      .then((text) => text.trim())
      .should((headingText) => {
        expect([...this.allowedHomePageHeaders]).to.include(
          headingText as (typeof this.allowedHomePageHeaders)[number],
        );
      })
      .then(() => log('done', 'Home landing page heading found'));

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
   * Navigates to Manual Account Creation using the direct home-area link.
   * Intended for journeys/users that still expose `#finesMacLink`.
   */
  public goToManualAccountCreationDirect(): void {
    log('navigate', 'Opening Manual Account Creation using direct dashboard link');
    this.ensureAccountsLandingPage();
    this.navigateToMac(
      L.manualAccountCreationLink,
      'Direct Manual Account Creation link not found; refreshing dashboard and retrying once',
    );
  }

  /**
   * Navigates to Manual Account Creation via **Create and Manage Draft Accounts (CAM)**.
   * Intended for inputter journeys where the Accounts area exposes
   * `#finesCavInputterLink`.
   */
  public goToManualAccountCreationViaCam(): void {
    log('navigate', 'Opening Manual Account Creation using Create and Manage Draft Accounts route');
    this.ensureAccountsLandingPage();
    this.navigateToMac(
      L.createAndManageDraftAccountsLink,
      'Create and Manage Draft Accounts link not found; refreshing dashboard and retrying once',
      () => {
        cy.get(CAM.createAccountButton, { timeout: 20_000 }).should('be.visible').click({ force: true });
      },
    );
  }

  /**
   * Navigates to Manual Account Creation using the requested home-area route variant.
   * @param route - `direct` uses `#finesMacLink`; `cam` uses
   * **Create and Manage Draft Accounts** and then the Create Account action.
   */
  public goToManualAccountCreation(route: 'direct' | 'cam' = 'cam'): void {
    if (route === 'direct') {
      this.goToManualAccountCreationDirect();
      return;
    }

    this.goToManualAccountCreationViaCam();
  }

  /**
   * Navigates from the authenticated home area to the "Search for an Account" page.
   *
   * Steps performed:
   *  1. If already on the Search landing page, reuses the current page.
   *  2. Otherwise clicks the Search link from the authenticated home area.
   *  3. Waits for the URL to include the Search route.
   *  3. Asserts that the search form component is rendered.
   *
   * @example
   *   dashboard.goToAccountSearch();
   */
  public goToAccountSearch(): void {
    log('navigate', 'Navigating to Search for an Account');

    cy.get('body', { timeout: 20_000 })
      .should('be.visible')
      .then(($body) => {
        // The search-first landing uses the primary navigation rather than the
        // legacy dashboard tile link, so use the active nav item + page heading
        // to decide whether navigation is already complete.
        const activeSearchNavItem = Cypress.$($body).find(
          `${PN.container} .moj-primary-navigation__link[aria-current="page"]`,
        );
        const activeItemText = activeSearchNavItem.text().trim();
        const pageText = $body.text();
        const alreadyOnSearchPage = activeItemText === 'Search' && pageText.includes('Search for an account');

        if (alreadyOnSearchPage) {
          log('navigate', 'Already on Search for an Account landing page');
          return;
        }

        cy.contains(`${PN.container} .moj-primary-navigation__link`, 'Search', this.common.getTimeoutOptions())
          .should('be.visible')
          .click();
      });

    cy.location('pathname', { timeout: 10_000 }).then((pathname) => {
      if (!pathname.includes('/fines/dashboard/search')) {
        log('navigate', 'Waiting for Search for an Account route to load');
      }
    });

    log('assert', 'Verifying Search for an Account page URL');
    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/dashboard/search');

    log('assert', 'Ensuring search page heading is visible');
    cy.contains('h1.govuk-heading-l, h1.govuk-heading-m, h1', 'Search for an account', { timeout: 10_000 }).should(
      'be.visible',
    );

    log('done', 'Successfully navigated to Search for an Account page');
  }

  /**
   * Navigates from the authenticated home area to the "Consolidate accounts" page.
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
    this.ensureAccountsLandingPage();

    cy.get(L.consolidateAccountsLink, { timeout: 10_000 }).should('be.visible').click({ force: true });

    log('assert', 'Verifying Consolidate accounts page URL');
    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/consolidation/select-business-unit');

    log('assert', 'Ensuring consolidation heading is visible');
    cy.get('h1.govuk-heading-l', { timeout: 10_000 }).should('contain.text', 'Consolidate accounts');

    log('done', 'Successfully navigated to Consolidate accounts page');
  }

  /**
   * Navigates to the Create and Manage Draft Accounts area for inputters.
   * Automatically moves to the Accounts landing page first when login lands on Search.
   *
   * @example
   *   dashboard.goToCreateAndManageDraftAccounts();
   */
  public goToCreateAndManageDraftAccounts(): void {
    log('navigate', 'Opening Create and Manage Draft Accounts');
    this.ensureAccountsLandingPage();
    cy.get(L.createAndManageDraftAccountsLink, { timeout: 10_000 }).should('be.visible').click({ force: true });
  }

  /**
   * Navigates to the Check and Validate Draft Accounts area for checkers.
   * Automatically moves to the Accounts landing page first when login lands on Search.
   *
   * @example
   *   dashboard.goToCheckAndValidateDraftAccounts();
   */
  public goToCheckAndValidateDraftAccounts(): void {
    log('navigate', 'Opening Check and Validate Draft Accounts');
    this.ensureAccountsLandingPage();
    cy.get(L.checkAndValidateDraftAccountsLink, { timeout: 10_000 }).should('be.visible').click({ force: true });
  }
}
