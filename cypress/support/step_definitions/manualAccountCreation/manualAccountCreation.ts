import { Then } from '@badeball/cypress-cucumber-preprocessor/';

Then('I navigate to Manual Account Creation', () => {
  cy.get('#manualAccountCreationLink').should('contain', 'Manually Create Account').click();
});

Then('I am on the manual account creation test page', () => {
  //update when PO-274 has been developed
  cy.get('#main-content > app-manual-account-creation > p').should('contain', 'Hello world!');
});
