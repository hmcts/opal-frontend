import { arrayBuffer } from 'stream/consumers';

export default class manualAccountPageObjects {
  static enterPrimaryEmail(primaryEmail: string) {
    cy.get('#primaryEmailAddress').should('be.visible').type(primaryEmail);
  }
  static enterSecondaryEmail(secondaryEmail: string) {
    cy.get('#secondaryEmailAddress').should('be.visible').type(secondaryEmail);
  }
  static enterMobileTelephone(mobileTelephone: string) {
    cy.get('#mobileTelephoneNumber').should('be.visible').type(mobileTelephone);
  }
  static enterHomeTelephone(homeTelephone: string) {
    cy.get('#homeTelephoneNumber').should('be.visible').type(homeTelephone);
  }
  static enterBusinessTelephone(businessTelephone: string) {
    cy.get('#businessTelephoneNumber').should('be.visible').type(businessTelephone);
  }
  static enterFirstNames(firstName: string) {
    cy.get('#firstNames').type(firstName);
  }
  static enterLastName(lastName: string) {
    cy.get('#lastName').type(lastName);
  }
}
