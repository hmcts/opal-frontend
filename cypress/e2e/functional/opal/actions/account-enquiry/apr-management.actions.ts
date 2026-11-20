import { ACCOUNT_ENQUIRY_PAYMENT_TERMS_ELEMENTS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.payment-terms.locators';
import { APR_MANAGEMENT_ELEMENTS as APR } from '../../../../../shared/selectors/account-enquiry/apr-management.locators';

/** Page interactions and assertions for APR Management. */
export class AprManagementActions {
  /** Opens APR Management through the Payment terms link. */
  public openFromPaymentTerms(): void {
    cy.get(L.aprManagementLink).should('be.visible').click();
  }

  /** Checks that Payment terms does not expose the APR Management link. */
  public assertLinkHidden(): void {
    cy.get(L.aprManagementLink).should('not.exist');
  }

  /** Opens the form for a new reference. */
  public startAddingReference(): void {
    cy.get(APR.addButton).should('be.visible').click();
  }

  /**
   * Opens the change form for the matching current reference.
   * @param reference - Reference value used in the scenario.
   */
  public startChangingReference(reference: string): void {
    cy.get(APR.currentTable)
      .contains(APR.referenceCell, reference)
      .closest('tr')
      .find(APR.changeLink)
      .should('be.visible')
      .click();
  }

  /**
   * Enters and submits the supplied reference value.
   * @param reference - Reference value used in the scenario.
   */
  public saveReference(reference: string): void {
    cy.get(APR.input).should('be.visible').clear().type(reference);
    cy.get(APR.saveButton).click();
  }

  /** Observes real create requests so the scenario can assert duplicate rejection. */
  public watchReferenceCreation(): void {
    cy.intercept('POST', '**/defendant-accounts/*/alternate-payment-references').as('createApr');
  }

  /**
   * Submits a replacement value while observing the real update request.
   * @param reference - Reference value used in the scenario.
   */
  public attemptDuplicateUpdate(reference: string): void {
    cy.intercept('PATCH', '**/defendant-accounts/*/alternate-payment-references/*').as('updateApr');
    this.saveReference(reference);
  }

  /**
   * Checks that the observed request failed because the reference is already in use.
   * @param operation - Observed APR operation.
   */
  public assertDuplicateRejected(operation: 'create' | 'update'): void {
    cy.wait(`@${operation}Apr`)
      .its('response')
      .should('include', { statusCode: 422 })
      .its('body.title')
      .should('equal', 'Alternate Payment Reference text already exists in business unit');
  }

  /** Checks the error summary for the 18-character limit. */
  public assertLengthError(): void {
    cy.get(APR.errorSummary)
      .should('be.visible')
      .and('contain.text', 'Payment reference must be 18 characters or fewer');
  }

  /**
   * Checks that the reference appears in the current account table.
   * @param reference - Reference value used in the scenario.
   */
  public assertCurrentReference(reference: string): void {
    cy.get(APR.currentTable).contains(APR.referenceCell, reference).should('be.visible');
  }

  /**
   * Checks that the reference is absent from the current account table.
   * @param reference - Reference value used in the scenario.
   */
  public assertNoCurrentReference(reference: string): void {
    cy.get(APR.currentTable).contains(APR.referenceCell, reference).should('not.exist');
  }

  /** Checks the empty state for the current account. */
  public assertNoCurrentReferences(): void {
    cy.get(APR.currentEmpty).should('be.visible');
  }

  /**
   * Opens the removal confirmation for the matching current reference.
   * @param reference - Reference value used in the scenario.
   */
  public startRemovingReference(reference: string): void {
    cy.get(APR.currentTable)
      .contains(APR.referenceCell, reference)
      .closest('tr')
      .find(APR.removeLink)
      .should('be.visible')
      .click();
  }

  /** Confirms the pending removal. */
  public confirmRemoval(): void {
    cy.get(APR.confirmRemoval).should('be.visible').click();
  }

  /** Cancels the pending removal. */
  public cancelRemoval(): void {
    cy.get(APR.cancelRemoval).should('be.visible').click();
  }

  /** Opens APR Management while observing the real list response. */
  public openWithReferences(): void {
    cy.intercept('GET', '**/defendant-accounts/*/alternate-payment-references').as('listAprs');
    this.openFromPaymentTerms();
  }

  /**
   * Checks that the API returned the read-only reference and the UI offers no removal action.
   * @param reference - Reference value used in the scenario.
   */
  public assertReadOnlyReferenceCannotBeRemoved(reference: string): void {
    cy.wait('@listAprs')
      .its('response.body')
      .should((references) => {
        expect(Cypress._.find(references, { apr_text: reference, relationship: 'CONSOLIDATED', category: 'ACC' })).to
          .exist;
      });
    cy.contains(APR.referenceCell, reference).should('not.exist');
    cy.contains(APR.removeLink, reference).should('not.exist');
  }
}
