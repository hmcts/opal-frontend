/**
 * @file common.actions.ts
 * @description
 * Cypress **Action class** providing generic, reusable helpers for form interactions
 * and edit flows within the HMCTS Opal UI.
 *
 * @remarks
 * - Encapsulates common UX patterns (e.g., cancel dialogs, value verification)
 *   to keep other Action classes lightweight.
 * - Used widely by flows such as `AccountEnquiryFlow`, `AccountDetailsDefendantActions`,
 *   and shared step definitions.
 * - Includes structured Cypress logging for consistent reporting.
 *
 * @example
 * ```ts
 * const common = new CommonActions();
 * common.verifyFieldValue('Company name', 'Acme Ltd');
 * common.cancelEditing(true);  // Leave edit form
 * ```
 */

export class CommonActions {
  /**
   * Logs a standardized Cypress entry for easier debugging in test reports.
   *
   * @param name - Log category (e.g., "input", "verify", "cancel").
   * @param message - Description of the action or assertion.
   * @param data - Optional contextual data (e.g., label name, expected value).
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
   * **Flow helper:** Cancels edit mode and remains on the edit form
   * (dismisses the “unsaved changes” confirmation dialog).
   *
   * @example
   * ```ts
   * common.cancelEditAndStay();
   * ```
   */
  cancelEditAndStay(): void {
    this.log('flow', 'Cancel edit and stay on page');
    this.cancelEditing(false);
  }
}
