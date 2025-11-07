import { AccountSearchIndividualsLocators as L } from '../../../../../shared/selectors/account.search.individuals.locators';
import { AccountEnquiryResultsLocators as R } from '../../../../../shared/selectors/accountEnquiryResults.locators';

export class AccountSearchIndividualsActions {
  byLastName(lastName: string): void {
    cy.get(L.lastNameInput, { timeout: 10000 }).clear().type(lastName);
    cy.get(L.searchButton).should('be.enabled').click();

    // Wait for results page & table
    cy.location('pathname', { timeout: 15000 }).should('include', '/fines/search-accounts/results');
    cy.get(R.page.heading, { timeout: 15000 }).should('contain.text', 'Search results');
    cy.get(R.table.root, { timeout: 15000 }).should('be.visible');
    cy.get(R.table.rows, { timeout: 15000 }).should('have.length.greaterThan', 0);
  }

  openLatestPublished(): void {
    // 👉 DO NOT assert .have.attr('href') — anchors don’t have one here
    cy.get(R.table.rows, { timeout: 15000 })
      .first()
      .within(() => {
        cy.get(R.cols.accountLink, { timeout: 10000 })
          .scrollIntoView()
          .should('be.visible')
          .then(($a) => {
            const acctNo = $a.text().trim();
            cy.wrap(acctNo, { log: false }).as('openedAccountNumber');
          })
          .click({ force: true }); // force because visibility can be flaky in tables
      });

    // wait for details route OR details shell to appear
    cy.location('pathname', { timeout: 15000 }).should((p) => {
      expect(p, 'navigated to details').to.match(/\/fines\/(accounts|draft-accounts)\/[A-Za-z0-9-]+/);
    });
  }

  openByAccountNumber(accountNumber: string): void {
    cy.get(R.table.root, { timeout: 15000 }).should('be.visible');
    // dynamic locator lives in locators file
    cy.get(R.linkByAccountNumber(accountNumber), { timeout: 8000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    cy.location('pathname', { timeout: 15000 }).should((p) => {
      expect(p).to.match(/\/fines\/(accounts|draft-accounts)\/[A-Za-z0-9-]+/);
    });
  }
}
