/**
 * @file common.actions.ts
 * @description Reusable Cypress helpers for navigation, header assertions, pagination checks,
 * text presence, dialog handling, and other cross-cutting UI utilities used by flows/actions.
 */
import { CommonLocators as L } from '../../../../../shared/selectors/common.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('CommonActions');

/**
 * Shared Cypress helpers used across multiple actions/flows.
 */
export class CommonActions {
  private readonly TIMEOUT = 10_000;
  private readonly PATH_TIMEOUT = 20_000;

  /**
   * Standard timeout options for most UI waits.
   * @returns Cypress timeout options object.
   */
  public getTimeoutOptions() {
    return { timeout: this.TIMEOUT };
  }

  /**
   * Timeout (ms) for requests that follow a navigation event.
   * @returns Timeout in milliseconds.
   */
  public getPathTimeout(): number {
    return this.PATH_TIMEOUT;
  }

  /**
   * Timeout options for requests that follow a navigation event.
   * @returns Cypress timeout options object.
   */
  public getPathTimeoutOptions() {
    return { timeout: this.PATH_TIMEOUT };
  }

  /**
   * Asserts that the page header **contains** the expected text.
   * @param expected - Text that should appear within the page header.
   * @param timeoutMs - Optional timeout override for the assertion.
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
   * @param accept - Whether to accept (`true`) or cancel (`false`) the dialog.
   * @param expected - Expected dialog text or regex matcher.
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
   * @param choice - Whether to accept (`ok`) or cancel (`cancel`) the navigation prompt.
   * @param waitFor - Optional URL substring or regex to assert after navigation.
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

  /**
   * Asserts that the given text exists somewhere on the current page, advancing pagination if needed.
   * @param text - Text to search for (case-sensitive as per `String.includes`).
   * @param maxPages - Maximum number of pagination advances to attempt.
   */
  public assertTextAcrossPages(text: string, maxPages: number = 10): void {
    const nextSelector = L.paginationNext;
    const normalize = (value: string) =>
      value
        .replace(/\s+/g, ' ')
        .replace(/\u00a0/g, ' ')
        .trim()
        .toLowerCase();
    const target = normalize(text);

    const scan = (remaining: number) => {
      cy.get('body', { timeout: 5000 }).then(($body) => {
        const pageText = ($body.text() ?? '').toString();
        const normalizedPage = normalize(pageText);
        if (normalizedPage.includes(target)) {
          expect(true, `Found text "${text}" on page`).to.be.true;
          return;
        }

        const next = $body.find(nextSelector);
        const hasNext = next.length > 0 && !next.closest('li').hasClass(L.paginationDisabledItem.replace('.', ''));

        if (hasNext && remaining > 0) {
          cy.wrap(next.first()).scrollIntoView().click({ force: true });
          cy.wait(500);
          scan(remaining - 1);
          return;
        }

        throw new Error(`Text "${text}" not found across paginated content`);
      });
    };

    scan(maxPages);
  }

  /**
   * Asserts that text exists on the current page without pagination.
   * @param text - Text to search for (case-insensitive).
   */
  public assertTextOnPage(text: string): void {
    const regexSafe = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    cy.contains('body', new RegExp(regexSafe, 'i'), { timeout: 5000 }).should(
      'exist',
      `Expected to find text "${text}" on the current page`,
    );
  }

  /**
   * Asserts that **no button** contains the given text (case-insensitive).
   * @param text - Button label that should be absent.
   */
  public assertButtonNotVisible(text: string): void {
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    log('assert', 'Verifying button text is absent', { text });

    cy.get('body', this.getTimeoutOptions())
      .find('button')
      .filter((_, el) => regex.test(el.innerText || el.textContent || ''))
      .should('have.length', 0);
  }
}
