import { CommonLocators as L } from '../../../../../shared/common.locators';
import { log } from '../../../../../support/utils/log.helper';

type NullableString = string | null;

export class CommonActions {
  private readonly TIMEOUT = 10_000;

  public getTimeoutOptions() {
    return { timeout: this.TIMEOUT };
  }

  /**
   * Asserts that the page header **contains** the expected text.
   * @param expected - Text that should appear within the page header.
   */
  public assertHeaderContains(expected: string, timeoutMs: number = 15_000): void {
    log('assert', `Header contains: ${expected}`);

    cy.get(L.header, { timeout: timeoutMs })
      .should('be.visible')
      .should(($el) => {
        const text = $el.text().toLowerCase();
        expect(text).to.include(expected.toLowerCase());
      });
  }

  /**
   * Asserts that the page header **equals** the expected text (exact match).
   * @param expected - The exact header text expected.
   */
  assertHeaderEquals(expected: string): void {
    log('verify', 'Checking header equals exact text', { expected });
    cy.get(L.header, { timeout: 15_000 }).should('have.text', expected);
  }

  /**
   * Asserts that the current URL contains the given substring.
   * @param urlPart - The part of the URL expected to be present.
   */
  urlContains(urlPart: string): void {
    cy.url().should('include', urlPart);
  }

  /**
   * Clicks a **real UI Cancel control** (e.g., Cancel link or button) and handles
   * the resulting **unsaved-changes native confirm() dialog**.
   *
   * @param confirmLeave
   *    - `true`  → simulate clicking **OK/Leave page**
   *    - `false` → simulate clicking **Cancel/Stay on page**
   */
  cancelEditing(confirmLeave: boolean): void {
    log('cancel', 'Handling Cancel click', { confirmLeave });

    cy.once('window:confirm', (msg) => {
      const normalized = msg.replaceAll(/\s+/g, ' ');
      expect(normalized, 'Confirm prompt message').to.match(/unsaved changes/i);
      return confirmLeave;
    });

    cy.contains('a.govuk-link, button, [role="button"]', /^cancel$/i)
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  /**
   * Prepares Cypress to auto-respond to the **next native confirm() dialog**
   * that appears — but does *NOT* trigger it.
   */
  public confirmNextUnsavedChanges(accept: boolean, expected: RegExp | string = /unsaved changes/i): void {
    cy.once('window:confirm', (msg) => {
      const normalized = String(msg).replaceAll(/\s+/g, ' ');
      if (expected instanceof RegExp) {
        expect(normalized).to.match(expected);
      } else {
        expect(normalized).to.include(expected);
      }
      return accept;
    });
  }

  /**
   * Performs a browser back navigation and handles the resulting confirm dialog.
   */
  public navigateBrowserBackWithChoice(choice: 'ok' | 'cancel', waitFor?: RegExp | string): void {
    const accept = choice === 'ok';

    log('dialog', `Preparing confirm dialog → ${choice.toUpperCase()}`);
    this.confirmNextUnsavedChanges(accept);

    log('navigate', 'Calling cy.go("back")');
    cy.go('back');

    if (!accept) {
      log('navigate', 'Cancel chosen → staying on page');
      return;
    }

    if (waitFor) {
      if (waitFor instanceof RegExp) {
        log('assert', `Asserting pathname matches ${waitFor}`);
        cy.location('pathname').should('match', waitFor);
      } else {
        log('assert', `Asserting URL includes "${waitFor}"`);
        cy.url().should('include', waitFor);
      }
    }
  }

  /**
   * Navigates to the Dashboard by selecting the global HMCTS homepage link.
   */
  public clickHmctsHomeLink(): void {
    const sel = L.hmctsHomeLink;
    if (!sel) {
      throw new TypeError('clickHmctsHomeLink: Locator CommonLocators.hmctsHomeLink is required but missing.');
    }

    log('action', 'Selecting HMCTS header link to return to the dashboard');
    cy.get(sel, this.getTimeoutOptions()).should('be.visible').click();
  }
}
