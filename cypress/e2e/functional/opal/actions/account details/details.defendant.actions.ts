// cypress/e2e/functional/opal/actions/account.details.actions.ts
import { AccountDefendantDetailsLocators as L } from '../../../../../shared/selectors/accountDetails/account.defendant.details.locators';
import { AccountNavDetailsLocators as N } from '../../../../../shared/selectors/accountDetails/account.nav.details.locators';
import { CommonActions } from '../common/common.actions';

export class AccountDetailsDefendantActions {
  readonly common = new CommonActions();

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
    this.common.getInputByLabel('First name').should('have.value', expected);
  }

  /** Reuse: header contains */
  assertHeaderContains(expected: string): void {
    cy.get(L.header, { timeout: 15000 }).should('contain.text', expected);
  }

  goToDefendantTab(): void {
    cy.get(N.subNav.defendantTab, { timeout: 10000 })
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
    cy.contains(N.changeLink, 'Change', { matchCase: false }).click({ force: true });
    cy.get(L.edit.form, { timeout: 10000 }).should('be.visible');
  }

  /** Update First name on edit form */
  updateFirstName(value: string): void {
    cy.get(L.edit.form, { timeout: 10000 }).should('be.visible');
    this.common.getInputByLabel('First name').then(($input) => {
      cy.wrap($input).clear().type(value).blur();
    });
  }
}
