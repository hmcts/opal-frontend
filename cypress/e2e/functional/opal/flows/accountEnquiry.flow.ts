import { AccountSearchIndividualsActions } from '../actions/search/search.individuals.actions';
import { AccountDetailsDefendantActions } from '../actions/account details/details.defendant.actions';
import { DashboardActions } from '../actions/dashboard.actions';
import { AccountSearchIndividualsLocators as L } from '../../../../shared/selectors/account.search.individuals.locators';
import { AccountEnquiryResultsLocators as R } from '../../../../shared/selectors/accountEnquiryResults.locators';
import { forceSingleTabNavigation } from '../../../../support/utils/navigation';
import { hasAccountLinkOnPage } from '../../../../support/utils/results';
import { clickLinkAcrossPages } from '../../../../support/utils/linkHelpers';
import { CommonActions } from '../actions/common/common.actions';

export class AccountEnquiryFlow {
  private readonly search = new AccountSearchIndividualsActions();
  private readonly details = new AccountDetailsDefendantActions();
  private readonly dashboard = new DashboardActions();
  private readonly common = new CommonActions();

  private ensureOnSearchPage() {
    cy.get('body').then(($b) => {
      const onSearch = $b.find(L.root).length > 0;
      if (!onSearch) this.dashboard.goToAccountSearch();
    });
  }

  public searchByLastName(surname: string) {
    this.ensureOnSearchPage();
    this.search.byLastName(surname);
  }

  public clickLatestPublishedFromResultsOrAcrossPages() {
    forceSingleTabNavigation();

    cy.get('@etagUpdate', { timeout: 0 })
      .then((etag: any) => etag?.accountNumber)
      .then((accountNumber?: string) => {
        if (accountNumber) {
          const acc = String(accountNumber).trim();
          return hasAccountLinkOnPage(acc).then((exists) => {
            if (exists) {
              cy.get(R.linkByAccountNumber(acc), { timeout: 5000 }).scrollIntoView().click({ force: true });
            } else {
              clickLinkAcrossPages(acc);
            }
          });
        }
        // Fallback: first row
        cy.get(R.table.rows, { timeout: 15000 })
          .first()
          .find(R.cols.accountLink)
          .scrollIntoView()
          .click({ force: true });
      });

    cy.location('pathname', { timeout: 15000 }).should((p) => {
      expect(p).to.match(/^\/fines\/account\/defendant\/[A-Za-z0-9-]+\/details$/);
    });
  }

  /** Convenience: search → then open */
  public searchAndClickLatestBySurname(surname: string) {
    Cypress.log({ name: 'search', message: `last name=${surname}` });
    this.searchByLastName(surname);
    Cypress.log({ name: 'open-latest', message: 'opening latest published or @etagUpdate match' });
    this.clickLatestPublishedFromResultsOrAcrossPages();
  }

  public assertDetailsHeaderContains(text: string) {
    this.details.assertHeaderContains(text);
  }

  public openMostRecentFromResults() {
    forceSingleTabNavigation();

    cy.get(R.table.rows, { timeout: 15000 })
      .first()
      .find(R.cols.accountLink)
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    cy.location('pathname', { timeout: 15000 }).should((p) => {
      // Match your actual details route: /fines/account/defendant/<id>/details
      expect(p).to.match(/^\/fines\/account\/defendant\/[A-Za-z0-9-]+\/details$/);
    });
  }

  public goToDefendantDetailsAndAssert(headerText: string) {
    this.details.goToDefendantTab();
    this.details.assertSectionHeader(headerText);
  }

  public editDefendantAndChangeFirstName(value: string) {
    this.details.startEditingDefendantDetails(); // handles clicking “Change”
    this.details.updateFirstName(value); // fills in the new name
  }

  /** User cancels editing but chooses “Cancel” in the confirmation dialog. */
  public cancelEditAndStay(): void {
    this.common.cancelEditing(false);
    this.details.assertStillOnEditPage();
  }

  /** User cancels editing and chooses “OK” in the confirmation dialog. */
  public cancelEditAndLeave(): void {
    this.common.cancelEditing(true);
    this.details.assertReturnedToAccountDetails();
  }
}
