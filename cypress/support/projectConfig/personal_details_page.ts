import { arrayBuffer } from 'stream/consumers';

export default class personalDetails {
  static enterFirstNames(firstName: string) {
    cy.get('#firstNames').find('input').clear().type(firstName);
  }
  static enterLastName(lastName: string) {
    cy.get('#lastName').find('input').clear().type(lastName);
  }
  static enterNINO(nino: string) {
    cy.get('#nationalInsuranceNumber').clear().type(nino);
  }
  static enterPostcode(postcode: string) {
    cy.get('#postcode').clear().type(postcode);
  }
  static selectTitle(title: string) {
    cy.get('select').select(title);
  }
  static enterAddressLine1(addLine1: string) {
    cy.get('#addressLine1').clear().type(addLine1);
  }
  static enterAddressLine2(addLine2: string) {
    cy.get('#addressLine1').find('input').clear().type(addLine2);
  }
  static enterAddressLine3(addLine3: string) {
    cy.get('#addressLine1').find('input').clear().type(addLine3);
  }
  static enterFirstNamesInAlias(firstNameAlias: string) {
    cy.get('.form').within(() => {
      cy.get('name').should('be.visible');
    });
    cy.get('#addAlias-conditional > fieldset >app-govuk-text-input > div > input').within(() => {
      cy.get('id').type(firstNameAlias);
    });
  }
  static enterLastNamesInAlias(lastNameAlias: string) {
    cy.get('#addAlias-conditional > fieldset >app-govuk-text-input >div>input').within(() => {
      cy.get('id').type(lastNameAlias);
    });
  }
}
