/// <reference types="cypress" />

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
    const menuSelectors = ['[data-cy="user-menu"]', '[data-cy="user-avatar"]', '[data-cy="user-toggle"]'];
    const signOutDataCy = '[data-cy="sign-out-button"]';
    const signOutTextRegex = /^sign[\s-]*out$/i;

    cy.document().then((doc) => {
      // Ensure any user menu is open first (if present)
      const menu = menuSelectors.map((s) => doc.querySelector(s)).find(Boolean) as HTMLElement | null;
      if (menu && !menu.classList.contains('open')) {
        cy.wrap(menu).click({ force: true });
      }

      // Prefer data-cy selector, otherwise find by visible text (buttons or links)
      let signOutEl = doc.querySelector(signOutDataCy) as HTMLElement | null;

      if (!signOutEl) {
        const candidates = Array.from(doc.querySelectorAll('button, a'));
        signOutEl = candidates.find((el) => {
          const txt = (el.textContent || '').trim();
          return signOutTextRegex.test(txt);
        }) as HTMLElement | null;
      }

      if (signOutEl) {
        cy.wrap(signOutEl).click({ force: true });
      } else {
        // Final fallback: Cypress text search (longer timeout)
        cy.contains(signOutTextRegex, { timeout: 7000 }).click({ force: true });
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
