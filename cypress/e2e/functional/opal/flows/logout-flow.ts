/// <reference types="cypress" />

import {
  logoutMenuSelectors,
  logoutSignOutButtonSelector,
  logoutSignOutTextRegex,
} from '../../../../shared/selectors/manual-account-creation/logout.locators';

/**
 * LogoutFlow
 *
 * Self-contained flow helpers for logout-related UI interactions used by Cypress tests.
 * Replaces a shared base class by keeping common helpers private within this class.
 */
export class LogoutFlow {
  /**
   * Sign out from the application.
   */
  signOut(): void {
    cy.document().then((doc) => {
      const menu = logoutMenuSelectors
        .map((s) => doc.querySelector(s))
        .find(Boolean) as HTMLElement | null;
      if (menu && !menu.classList.contains('open')) {
        cy.wrap(menu).click({ force: true });
      }

      let signOutEl =
        doc.querySelector(logoutSignOutButtonSelector) as HTMLElement | null;

      if (!signOutEl) {
        const candidates = Array.from(doc.querySelectorAll('button, a'));
        signOutEl = candidates.find((el) => {
          const txt = (el.textContent || '').trim();
          return logoutSignOutTextRegex.test(txt);
        }) as HTMLElement | null;
      }

      if (signOutEl) {
        cy.wrap(signOutEl).click({ force: true });
      } else {
        cy.contains(logoutSignOutTextRegex, { timeout: 7000 }).click({ force: true });
      }
    });
  }

  /**
   * Verify the current page by checking the page header text.
   *
   * @param pageName - The expected page name to verify
   */
  verifyPage(pageName: string): void {
    cy.get('[data-cy="page-header"] h1', { timeout: 10000 }).should('contain.text', pageName);
  }

  /**
   * Verify the user is being redirected to the sign-in flow (SSO auth entry point).
   *
   * @returns void
   */
  verifySignInFlow(): void {
    const authUrlPattern =
      /(login\.microsoftonline\.com|microsoftonline\.com|login\.windows\.net|\/auth(?:\/|$)|\/sign-?in(?:\/|$)|\/login(?:\/|$))/i;
    cy.url({ timeout: 15000 }).should('match', authUrlPattern);
  }
}
