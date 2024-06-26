import { arrayBuffer } from 'stream/consumers';

export default class personalDetails {
  static enterFirstNames(firstName: string) {
    cy.get('#firstNames').clear().type(firstName);
  }
  static enterLastName(lastName: string) {
    cy.get('#lastName').clear().type(lastName);
  }
  static enterNINO(nino: string) {
    cy.get('#nationalInsuranceNumber').clear().type(nino);
  }
  static enterTitle(title: string) {
    cy.get('select').select(title);
  }
  static enterAddressLine1(addLine1: string) {
    cy.get('#addressLine1').clear().type(addLine1);
  }
  static enterFirstNamesInAlias(firstNameAlias: string) {
    cy.get('#addAlias-conditional > fieldset >app-govuk-text-input >div>input').clear().type(firstNameAlias);
  }
  static enterLastNamesInAlias(lastNameAlias: string) {
    cy.get('#addAlias-conditional > fieldset >app-govuk-text-input >div>input').clear().type(lastNameAlias);
  }
}
