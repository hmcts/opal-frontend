import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I navigate to Create and Manage Draft Accounts', () => {
  cy.get('#finesCavInputterLink').should('contain', 'Create and Manage Draft Accounts').click();
});
Then('I navigate to Check and Validate Draft Accounts', () => {
  cy.get('#finesCavCheckerLink').should('contain', 'Check and Validate Draft Accounts').click();
});
Then('I navigate to the {string} tab', (tabName: string) => {
  cy.contains('a', tabName).click();
});
