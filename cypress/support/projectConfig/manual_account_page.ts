import { arrayBuffer } from 'stream/consumers';

export default class manualAccountPageObjects {
  static enterEmployerName(employerName: string) {
    cy.get('#employerName').should('be.visible').type(employerName);
  }

  static enterEmployeeReferenceNumber(text: string) {
    cy.get('#employeeReference').should('be.be.visible').type(text);
  }

  static enterEmployerEmail(text: string) {
    cy.get('#employerEmailAddress').type(text);
  }

  static enterEmployerTelephone(text: string) {
    cy.get('#employerTelephone').type(text);
  }
  static enterEmployerAddressLine1(text: string) {
    cy.get('#employerAddress1').type(text);
  }

  static enterEmployerAddressLine2(text: string) {
    cy.get('#employerAddress2').type(text);
  }
  static enterEmployerPostcode(text: string) {
    cy.get('#employerPostcode').type(text);
  }
  static enterEmployerAddressLine3(text: string) {
    cy.get('#employerAddress3').type(text);
  }
  static enterEmployerAddressLine4(text: string) {
    cy.get('#employerAddress4').type(text);
  }
  static enterEmployerAddressLine5(text: string) {
    cy.get('#employerAddress5').type(text);
  }
  static verifyErrorSummary() {
    cy.get('h2').should('have.text', 'There is a problem');
  }
  static verifyEmployerDetailsErrorMessages() {
    const errors: string[] = [];
    cy.get('ul>li')
      .each(($li) => errors.push($li.text()))
      .then(() => {
        cy.log(errors.join(','));
        // cy.wrap(a).should('deep.equal',[          'The employer name must be 35 characters or fewer'
        //                                           ,'The employee reference must be 20 characters or fewer'
        //                                           ,'Enter employer email address in the correct format like, name@example.com'
        //                                           ,'Enter employer telephone number in the correct format'
        //                                           ,'The employer address line 1 must be 30 characters or fewer'
        //                                           ,'The employer address line 2 must be 30 characters or fewer'
        //                                           ,'The employer address line 3 must be 30 characters or fewer'
        //                                           ,'The employer address line 4 must be 30 characters or fewer'
        //                                           ,'The employer address line 5 must be 30 characters or fewer'
        //                                           ,'The employer postcode must be 8 characters or fewer']);
        cy.wrap(errors).should('deep.equal', errors);
      });
  }
}
