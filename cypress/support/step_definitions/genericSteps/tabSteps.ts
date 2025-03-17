import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I see the rejected tab has the suffix {string}', (suffix: string) => {
  cy.get('#inputter-rejected-tab-notifications').should('contain.text', suffix);
});
