import { AccountNavDetailsLocators as N } from '../../../../../shared/selectors/accountDetails/account.nav.details.locators';

export class AccountDetailsNavActions {
  /** Click the "Add account note" button */
  clickAddAccountNoteButton(): void {
    cy.get(N.addAccountNoteButton, { timeout: 10000 }).should('be.visible').click({ force: true });
  }
}
