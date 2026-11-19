import { ACCOUNT_ENQUIRY_PAYMENT_TERMS_ELEMENTS as L } from '../../../../../shared/selectors/account-enquiry/account.enquiry.payment-terms.locators';

export class AprManagementActions {
  public openFromPaymentTerms(): void {
    cy.get(L.aprManagementLink).should('be.visible').click();
  }

  public assertLinkHidden(): void {
    cy.get(L.aprManagementLink).should('not.exist');
  }
}
