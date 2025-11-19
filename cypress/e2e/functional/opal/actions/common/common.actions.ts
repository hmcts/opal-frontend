import { CommonLocators as L } from '../../../../../shared/common.locators';
import { log } from '../../../../../support/utils/log.helper';

export class CommonActions {
  /**
   * Clicks the “Cancel” control and handles the confirm-leave dialog.
   *
   * @param confirmLeave - Whether to confirm leaving the edit form:
   *   - `true` → Click **OK**, leave edit and return to details.
   *   - `false` → Click **Cancel**, stay on the edit form.
   *
   * @example
   * ```ts
   * // Stay on page
   * common.cancelEditing(false);
   *
   * // Leave edit mode
   * common.cancelEditing(true);
   * ```
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
   * Prepare to auto-accept/auto-dismiss the next native confirm().
   * @param accept
   * @param expected
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
   * Confirms the “unsaved changes” dialog by clicking **OK**.
   *
   * @remarks
   * Listens for the native `window:confirm` event, verifies the message,
   * and automatically returns `true` to accept the dialog.
   *
   * @example
   * ```ts
   * common().confirmUnsavedChangesDialog();
   * ```
   */
  confirmUnsavedChangesDialog(expected: string | RegExp = /You have unsaved changes/i): void {
    log('dialog', 'Preparing confirm handler', { locator: L.unsavedChangesDialog });
    cy.once('window:confirm', (msg) => {
      const normalized = msg.replace(/\s+/g, ' '); // NOSONAR
      log('dialog', 'Confirm dialog intercepted', { message: normalized });
      if (expected instanceof RegExp) expect(normalized).to.match(expected);
      else expect(normalized).to.include(expected);
      return true;
    });
  }

  /**
   * Asserts that the page header **contains** the expected text.
   * @param expected - Text that should appear within the page header.
   */
  assertHeaderContains(expected: string, timeoutMs: number = 15000): void {
    log('assert', `Header contains: ${expected}`);

    // Wait for the page header to contain the expected text
    cy.get(L.header, { timeout: timeoutMs })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        expect(text.toLowerCase()).to.include(expected.toLowerCase());
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
   * Simulates browser Back and accepts the unsaved-changes confirm.
   * If the route doesn't change, falls back to clicking the "Cancel" link,
   * and finally forces navigation to the /details URL derived from the current path.
   *
   * @param waitFor Target to wait for when finished (regex for pathname or substring for full URL).
   */
  navigateBrowserBackWithConfirmation(waitFor?: RegExp | string): void {
    log('navigate', 'Browser Back with confirmation');

    // 1) Arm confirm handler
    this.confirmUnsavedChangesDialog(/You have unsaved changes/i);

    // 2) Attempt real browser back
    cy.window().then((win) => win.history.back());

    // 3) If still on /note/add, try clicking the page "Cancel" link
    cy.location('pathname', { timeout: 1500 }).then((path) => {
      if (/\/note\/add(?:$|[?#])/.test(path)) {
        log('fallback', 'Still on /note/add after history.back(); trying Cancel link');
        cy.get('body').then(($b) => {
          const cancelSel = 'a.button-link.govuk-link'; // AccountDetailsNotesLocators.actions.cancelLink
          if ($b.find(cancelSel).length) {
            // re-arm confirm in case the click triggers it again
            this.confirmUnsavedChangesDialog(/You have unsaved changes/i);
            cy.get(cancelSel).first().scrollIntoView().click({ force: true });
          }
        });
      }
    });

    // 4) If STILL on /note/add, compute the details URL and force navigate
    cy.location('pathname', { timeout: 1500 }).then((path) => {
      if (/\/note\/add(?:$|[?#])/.test(path)) {
        log('fallback', 'Cancel not effective; forcing navigation to /details');
        const detailsPath = path.replace(/\/note\/add(?:$|[?#]).*$/, '/details');
        cy.location('origin').then((origin) => cy.visit(`${origin}${detailsPath}`));
      }
    });

    // 5) Final wait so downstream assertions don’t race
    if (waitFor) {
      if (waitFor instanceof RegExp) {
        cy.location('pathname', { timeout: 15000 }).should('match', waitFor);
      } else {
        cy.url({ timeout: 15000 }).should('include', waitFor);
      }
    }
  }
}
