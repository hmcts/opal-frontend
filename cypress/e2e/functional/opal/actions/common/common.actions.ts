export class CommonActions {
  /** Helper: find an input by its visible label text */
  getInputByLabel(labelText: string) {
    return cy
      .contains('label', labelText, { matchCase: false })
      .invoke('attr', 'for')
      .then((forId) => {
        if (forId) return cy.get(`#${forId}`);
        // Fallback: label wraps the input
        return cy.contains('label', labelText, { matchCase: false }).find('input, textarea, select');
      });
  }

  /** Click Cancel and handle the confirm-leave dialog
   *  confirmLeave = true  -> click "OK" (leave edit, return to details)
   *  confirmLeave = false -> click "Cancel" (stay on edit page)
   */
  cancelEditing(confirmLeave: boolean): void {
    // Prepare the confirm response BEFORE clicking Cancel
    cy.window().then(() => {
      cy.once('window:confirm', (msg) => {
        // Optional: assert the prompt text is what you expect
        expect(msg).to.contain('You have unsaved changes');
        return confirmLeave; // true = OK (leave), false = Cancel (stay)
      });
    });

    // Click the Cancel control (link/button)
    cy.contains('a.govuk-link, button, [role="button"]', 'Cancel', { matchCase: false })
      .should('be.visible')
      .click({ force: true });
  }
}
