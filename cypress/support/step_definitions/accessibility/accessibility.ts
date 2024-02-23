import { Then } from '@badeball/cypress-cucumber-preprocessor/';
import 'cypress-axe';

Then('I check accessibility', () => {
  cy.injectAxe();
  cy.wait(500);
  cy.checkA11y();
});
