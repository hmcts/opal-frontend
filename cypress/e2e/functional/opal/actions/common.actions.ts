import { CommonLocators as L } from '../../../../shared/common.locators';
import { log } from '../../../../support/utils/log.helper';

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
  public assertHeaderContains(expected: string, timeoutMs: number = 15000): void {
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
    cy.get(L.header, { timeout: 15000 }).should('have.text', expected);
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
   * This method should be used **ONLY** when:
   *  - The user is clicking a Cancel element visible in the UI.
   *  - That click triggers an unsaved-changes confirm dialog.
   *
   * Behaviour:
   *  1. Installs a one-time `window:confirm` handler that returns either:
   *      - `true`  → user chose “OK/Leave”
   *      - `false` → user chose “Cancel/Stay”
   *  2. Clicks the UI Cancel control.
   *  3. The handler resolves the confirm dialog triggered *by the click*.
   *
   * This method DOES:
   *  - Validate the confirm message
   *  - Click a real element in the DOM
   *  - Trigger the SPA’s actual cancel workflow
   *
   * This method does NOT:
   *  - Work for browser back navigation
   *  - Work for programmatic router navigation
   *  - Prepare for a confirm triggered by something other than the Cancel button
   *
   * @param confirmLeave
   *    - `true`  → simulate clicking **OK/Leave page**
   *    - `false` → simulate clicking **Cancel/Stay on page**
   *
   * @example
   *  // Press Cancel in the UI and choose OK/Leave:
   *  common.cancelEditing(true);
   *
   * @example
   *  // Press Cancel in the UI and choose Cancel/Stay:
   *  common.cancelEditing(false);
   */

  cancelEditing(confirmLeave: boolean): void {
    log('cancel', 'Handling Cancel click', { confirmLeave });

    cy.once('window:confirm', (msg) => {
      const normalized = msg.replaceAll(/\s+/g, ' '); // use replaceAll for lint rule
      expect(normalized, 'Confirm prompt message').to.match(/unsaved changes/i);
      return confirmLeave; // true -> OK, false = Cancel
    });

    // Click a real, visible Cancel (avoid force so we get the real event)
    cy.contains('a.govuk-link, button, [role="button"]', /^cancel$/i)
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }

  /**
   * Prepares Cypress to auto-respond to the **next native confirm() dialog**
   * that appears — but does *NOT* trigger it.
   *
   * This is a **preparation-only** method.
   * No UI interaction occurs here.
   *
   * Use this when the confirm dialog is triggered by:
   *  - Browser Back (`cy.go('back')`)
   *  - Navigation links
   *  - Router guards
   *  - Programmatic navigation (e.g., leaving a screen)
   *  - Any action where **you are NOT clicking the UI Cancel button**
   *
   * Behaviour:
   *  1. Installs `cy.once('window:confirm')` to intercept the very next confirm().
   *  2. When a confirm occurs, returns:
   *      - `true`  → simulate clicking “OK/Leave”
   *      - `false` → simulate clicking “Cancel/Stay”
   *
   * This method DOES:
   *  - Only prepare the next confirm handler
   *  - Validate the confirm message text
   *
   * This method does NOT:
   *  - Perform navigation
   *  - Click any UI element
   *  - Trigger confirm by itself
   *
   * @param accept
   *    - `true`  → answer YES / Leave / OK
   *    - `false` → answer NO / Cancel / Stay
   * @param expected
   *    Optional RegExp/string to validate the dialog message text.
   *
   * @example
   *  // Prepare to accept confirm caused by browser back:
   *  common.confirmNextUnsavedChanges(true);
   *  cy.go('back');
   *
   * @example
   *  // Prepare to cancel confirm caused by a navigation link:
   *  common.confirmNextUnsavedChanges(false);
   *  cy.contains('a','Next page').click();
   */
  public confirmNextUnsavedChanges(accept: boolean, expected: RegExp | string = /unsaved changes/i): void {
    cy.once('window:confirm', (msg) => {
      const normalized = String(msg).replaceAll(/\s+/g, ' ');
      if (expected instanceof RegExp) {
        expect(normalized).to.match(expected);
      } else {
        expect(normalized).to.include(expected);
      }
      return accept; // true = OK (leave), false = Cancel (stay)
    });
  }

  /**
   * Performs a **browser back navigation** (`cy.go('back')`) and handles the
   * resulting unsaved-changes confirm dialog using the provided choice.
   *
   * Use this when:
   *  - You are simulating the user clicking the browser back button.
   *  - A confirm dialog appears due to unsaved changes.
   *  - There is **NO UI Cancel button** to click (common in many flows).
   *
   * Behaviour:
   *  1. Calls `confirmNextUnsavedChanges()` with the correct boolean:
   *        'ok'     → true  (leave page)
   *        'cancel' → false (stay on page)
   *
   *  2. Calls `cy.go('back')` — SPA router will fire confirm, Cypress intercepts it.
   *
   *  3. If the choice is:
   *       - `'cancel'` → remain on the same page (no further checks)
   *       - `'ok'`     → optionally assert final URL/path if `waitFor` is provided
   *
   * This method DOES:
   *  - Properly simulate browser back + OK/Cancel
   *  - Work across all flows where back navigation is allowed
   *  - Keep step definitions extremely thin
   *
   * This method does NOT:
   *  - Click UI Cancel elements (use `cancelEditing()` for that)
   *  - Force navigation
   *  - Attempt router hacks, popstate injection, or hard redirects
   *
   * @param choice
   *    - `'ok'`     → respond OK/Leave to confirm()
   *    - `'cancel'` → respond Cancel/Stay to confirm()
   *
   * @param waitFor
   *    Optional:
   *      - RegExp  → matched against `location.pathname`
   *      - string  → required substring in final `cy.url()`
   *    Only applied when choice === 'ok'.
   *
   * @example
   *  // Browser back and allow leaving:
   *  common.navigateBrowserBackWithChoice('ok', /\/dashboard$/);
   *
   * @example
   *  // Browser back and stay on page:
   *  common.navigateBrowserBackWithChoice('cancel');
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
   *
   * Behaviour:
   * - Uses the shared header locator (C.hmctsHomeLink) — no fallback selectors.
   * - Asserts the link exists before interacting.
   * - Performs a single intent-based navigation (actual click verb occurs here).
   * - After the click, responsibility for verifying arrival lies with the flow.
   *
   * Notes:
   * - Required locator: C.hmctsHomeLink
   * - This method should remain UI-verby because actions encapsulate UI mechanics.
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
