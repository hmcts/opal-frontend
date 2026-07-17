/// <reference types="cypress" />

/**
 * LogoutFlow
 *
 * Self-contained flow helpers for logout-related UI interactions used by Cypress tests.
 * Replaces a shared base class by keeping common helpers private within this class.
 */
export class LogoutFlow {
  /**
   * Click the "Create account" control.
   */
  clickCreateAccount(): void {
    this.clickNavElement('create-account');
    this.waitForPageLoad();
  }

  /**
   * Click the "Search" control.
   */
  clickSearch(): void {
    this.clickNavElement('search');
    this.waitForPageLoad();
  }

  /**
   * Open the account area or user menu.
   */
  clickAccount(): void {
    this.clickNavElement('account');
    this.waitForPageLoad();
  }

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
    const headerSelector = '[data-cy="page-header"] h1';
    const altSelectors = ['[data-cy="page-title"]', 'h1', 'h2'];
    const slug = pageName.toLowerCase().replace(/\s+/g, '-');
    const timeout = 15000;

    // Prefer the explicit page-header if present, otherwise try sensible fallbacks,
    // finally fall back to URL pathname or document title checks.
    cy.document().then((doc) => {
      if (doc.querySelector(headerSelector)) {
        cy.get(headerSelector, { timeout }).should('contain.text', pageName);
        return;
      }

      const foundAlt = altSelectors.find((s) => Boolean(doc.querySelector(s)));
      if (foundAlt) {
        cy.get(foundAlt!, { timeout }).should('contain.text', pageName);
        return;
      }

      // Fallback: assert on pathname or document.title to reduce flakiness when headers are absent.
      cy.location('pathname', { timeout }).then((path) => {
        if (typeof path === 'string' && path.includes(slug)) {
          // pathname contains expected slug — pass
          return;
        }
        // final fallback: ensure document title contains the page name (case-insensitive)
        cy.title({ timeout }).should('match', new RegExp(pageName, 'i'));
      });
    });
  }

  /**
   * Wait for a page-level header to become visible.
   * @param timeout
   */
  private waitForPageLoad(timeout: number = 10000): void {
    const headerSelector = '[data-cy="page-header"]';

    // If the page-header exists, wait for it to be visible; otherwise ensure body exists.
    cy.document().then((doc) => {
      if (doc.querySelector(headerSelector)) {
        cy.get(headerSelector, { timeout }).should('be.visible');
      } else {
        // No explicit header present on this page; wait for body to be present as a lightweight sync point.
        cy.get('body', { timeout }).should('exist');
      }
    });
  }

  /**
   * Click an element by selector, ensuring visibility first.
   * @param selector
   */
  private clickElement(selector: string): void {
    cy.get(selector, { timeout: 10000 }).should('be.visible').click({ force: true });
  }

  /**
   * Click navigation elements with data-cy fallback to text match.
   * @param elementName
   */
  private clickNavElement(elementName: string): void {
    const selector = `a[data-cy="${elementName}"], button[data-cy="${elementName}"], [data-cy="${elementName}"]`;

    cy.document().then((doc) => {
      const el = doc.querySelector(selector) as HTMLElement | null;
      if (el) {
        cy.wrap(el).click({ force: true });
      } else {
        cy.contains(new RegExp(`^${elementName}$`, 'i'), { timeout: 10000 }).click({ force: true });
      }
    });
  }
}
