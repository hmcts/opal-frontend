import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I navigate to Create and Manage Draft Accounts', () => {
  cy.get('#finesCavInputterLink').should('contain', 'Create and Manage Draft Accounts').click();
});
