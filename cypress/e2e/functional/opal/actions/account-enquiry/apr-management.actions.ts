import { ACCOUNT_ENQUIRY_PAYMENT_TERMS_ELEMENTS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.payment-terms.locators';
import { APR_MANAGEMENT_ELEMENTS as APR } from '../../../../../shared/selectors/account-enquiry/apr-management.locators';

export class AprManagementActions {
  public openFromPaymentTerms(): void {
    cy.get(L.aprManagementLink).should('be.visible').click();
  }

  public assertLinkHidden(): void {
    cy.get(L.aprManagementLink).should('not.exist');
  }

  public startAddingReference(): void {
    cy.get(APR.addButton).should('be.visible').click();
  }

  public startChangingReference(reference: string): void {
    cy.get(APR.currentTable)
      .contains(APR.referenceCell, reference)
      .closest('tr')
      .find(APR.changeLink)
      .should('be.visible')
      .click();
  }

  public saveReference(reference: string): void {
    cy.get(APR.input).should('be.visible').clear().type(reference);
    cy.get(APR.saveButton).click();
  }

  public watchReferenceCreation(): void {
    cy.intercept('POST', '**/defendant-accounts/*/alternate-payment-references').as('createApr');
  }

  public assertDuplicateRejected(): void {
    cy.wait('@createApr')
      .its('response')
      .should('include', { statusCode: 422 })
      .its('body.title')
      .should('equal', 'Alternate Payment Reference text already exists in business unit');
  }

  public assertLengthError(): void {
    cy.get(APR.errorSummary)
      .should('be.visible')
      .and('contain.text', 'Payment reference must be 18 characters or fewer');
  }

  public assertCurrentReference(reference: string): void {
    cy.get(APR.currentTable).contains(APR.referenceCell, reference).should('be.visible');
  }

  public assertNoCurrentReference(reference: string): void {
    cy.get(APR.currentTable).contains(APR.referenceCell, reference).should('not.exist');
  }

  public assertNoCurrentReferences(): void {
    cy.get(APR.currentEmpty).should('be.visible');
  }
}
