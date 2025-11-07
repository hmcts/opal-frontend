// cypress/e2e/functional/opal/actions/account.details.actions.ts
import { AccountDetailsLocators as L } from '../../../../shared/selectors/account.details.locators';

export class AccountDetailsActions {
  /** Helper: find an input by its visible label text */
  private getInputByLabel(labelText: string) {
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

  /** After leaving the edit form, ensure we’re back on details */
  assertReturnedToAccountDetails(): void {
    cy.location('pathname', { timeout: 15000 }).should((p) => {
      expect(p, 'on details route').to.match(/^\/fines\/account\/defendant\/[A-Za-z0-9-]+\/details$/);
    });
    cy.get('main h1.govuk-heading-l, .account-details__header', { timeout: 10000 }).should('be.visible');
  }

  /** Ensure we are still on the edit page (form visible, not navigated away) */
  assertStillOnEditPage(): void {
    // You're still on the edit form
    cy.get('[class*="account-details__form"], form', { timeout: 10000 }).should('be.visible');
  }

  /** Assert the First name field’s value */
  assertFirstNameValue(expected: string): void {
    this.getInputByLabel('First name').should('have.value', expected);
  }

  /** Reuse: header contains */
  assertHeaderContains(expected: string): void {
    cy.get(L.header, { timeout: 15000 }).should('contain.text', expected);
  }

  goToDefendantTab(): void {
    cy.get(L.tabs.defendant, { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.contains('a.moj-sub-navigation__link', 'Defendant', { matchCase: false }).click();
      });

    // tab becomes current
    cy.contains('a.moj-sub-navigation__link', 'Defendant', { matchCase: false })
      .should('be.visible')
      .and('have.attr', 'aria-current', 'page');
  }

  assertSectionHeader(expected: string): void {
    cy.get(L.view.sectionHeader, { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .then((t) => expect(t.trim().toLowerCase()).to.contain(expected.trim().toLowerCase()));
  }

  /** Navigate to Defendant and click Change; land on edit form */
  startEditingDefendantDetails(): void {
    this.goToDefendantTab();
    this.assertSectionHeader('Defendant');
    cy.contains(L.view.changeLink, 'Change', { matchCase: false }).click({ force: true });
    cy.get(L.edit.form, { timeout: 10000 }).should('be.visible');
  }

  /** Update First name on edit form */
  updateFirstName(value: string): void {
    cy.get(L.edit.form, { timeout: 10000 }).should('be.visible');
    this.getInputByLabel('First name').then(($input) => {
      cy.wrap($input).clear().type(value).blur();
    });
  }
}
