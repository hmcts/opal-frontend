export default class manualAccountPageObjects {
  static enterPrimaryEmail(primaryEmail: string) {
    cy.get('#primaryEmailAddress').clear();
    cy.get('#primaryEmailAddress').should('be.visible').type(primaryEmail);
  }
  static enterSecondaryEmail(secondaryEmail: string) {
    cy.get('#secondaryEmailAddress').clear();
    cy.get('#secondaryEmailAddress').should('be.visible').type(secondaryEmail);
  }
  static enterMobileTelephone(mobileTelephone: string) {
    cy.get('#mobileTelephoneNumber').clear();
    cy.get('#mobileTelephoneNumber').should('be.visible').type(mobileTelephone);
  }
  static enterHomeTelephone(homeTelephone: string) {
    cy.get('#homeTelephoneNumber').clear();
    cy.get('#homeTelephoneNumber').should('be.visible').type(homeTelephone);
  }
  static enterWorkTelephone(workTelephone: string) {
    cy.get('#workTelephoneNumber').clear();
    cy.get('#workTelephoneNumber').should('be.visible').type(workTelephone);
  }
}
