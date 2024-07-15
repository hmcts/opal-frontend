import { Then } from '@badeball/cypress-cucumber-preprocessor';
import 'cypress-axe';

Then('I check accessibility', () => {
  cy.injectAxe();
  cy.checkA11y();
});
//Only use for accessibility testing
Then('I navigate to {string} URL', (url: string) => {
  cy.visit(url);
});
