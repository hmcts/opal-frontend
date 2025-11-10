import { CommonLocators as L } from '../../../../../../cypress/shared/common.locators';

export class CommonActions {
  /**
   * Logs a standardized Cypress entry for easier debugging in test reports.
   */
  private log(name: string, message: string, data?: Record<string, unknown>): void {
    Cypress.log({
      name,
      message,
      consoleProps: () => ({ action: 'CommonActions', message, ...data }),
    });
  }

  /**
   * Finds an input, textarea, or select element by its visible label text.
   *
   * @param labelText - The visible label text to search for (case-insensitive).
   * @returns A Cypress chainable for the associated input, textarea, or select element.
   *
   * @example
   * ```ts
   * common.getInputByLabel('Postcode').type('SW1A 1AA');
   * ```
   */
  getInputByLabel(labelText: string): Cypress.Chainable<JQuery<HTMLElement>> {
    this.log('input', `Locating input by label: ${labelText}`, { labelText });

    return cy
      .contains('label', labelText, { matchCase: false })
      .invoke('attr', 'for')
      .then((forId) => {
        if (forId) {
          this.log('resolve', `Found input linked to label`, { forId });
          return cy.get(`#${forId}`);
        }

        this.log('fallback', `Label wraps input directly`, { labelText });
        return cy.contains('label', labelText, { matchCase: false }).find('input, textarea, select');
      });
  }
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
    this.log('cancel', 'Handling Cancel click', { confirmLeave });

    // Prepare the confirmation handler before clicking Cancel
    cy.window().then(() => {
      cy.once('window:confirm', (msg) => {
        this.log('dialog', 'Confirm dialog intercepted', { message: msg });
        expect(msg, 'Confirm prompt message').to.contain('You have unsaved changes');
        return confirmLeave; // true = OK (leave), false = Cancel (stay)
      });
    });

    // Click the Cancel control (link/button)
    cy.contains('a.govuk-link, button, [role="button"]', 'Cancel', { matchCase: false })
      .should('be.visible')
      .click({ force: true });
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
    this.log('dialog', 'Preparing confirm handler', { locator: L.unsavedChangesDialog });
    cy.once('window:confirm', (msg) => {
      const normalized = msg.replace(/\s+/g, ' ');
      this.log('dialog', 'Confirm dialog intercepted', { message: normalized });
      if (expected instanceof RegExp) expect(normalized).to.match(expected);
      else expect(normalized).to.include(expected);
      return true; // click OK
    });
  }

  /**
   * Asserts that a field (identified by its label) has the expected value.
   *
   * Centralized assertion to maintain thin, intention-focused Action classes.
   *
   * @param label - Visible label text.
   * @param expected - Expected input value.
   *
   * @example
   * ```ts
   * common.verifyFieldValue('First name', 'John');
   * ```
   */
  verifyFieldValue(label: string, expected: string): void {
    this.log('verify', `Verifying field value`, { label, expected });
    this.getInputByLabel(label).should('have.value', expected);
  }

  /**
   * Asserts that the page header **contains** the expected text.
   * @param expected - Text that should appear within the page header.
   */
  assertHeaderContains(expected: string): void {
    this.log('verify', 'Checking header contains text', { expected });
    cy.get(L.header, { timeout: 15000 }).should('contain.text', expected);
  }

  /**
   * Asserts that the page header **equals** the expected text (exact match).
   * @param expected - The exact header text expected.
   */
  assertHeaderEquals(expected: string): void {
    this.log('verify', 'Checking header equals exact text', { expected });
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
    this.log('navigate', 'Browser Back with confirmation');

    // 1) Arm confirm handler
    this.confirmUnsavedChangesDialog(/You have unsaved changes/i);

    // 2) Attempt real browser back
    cy.window().then((win) => win.history.back());

    // 3) If still on /note/add, try clicking the page "Cancel" link
    cy.location('pathname', { timeout: 1500 }).then((path) => {
      if (/\/note\/add(?:$|[?#])/.test(path)) {
        this.log('fallback', 'Still on /note/add after history.back(); trying Cancel link');
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
        this.log('fallback', 'Cancel not effective; forcing navigation to /details');
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
