import { Then } from '@badeball/cypress-cucumber-preprocessor/';
import 'cypress-axe';

Then('Check Accessibility', () => {
  cy.injectAxe();
  cy.wait(500);
  cy.checkA11y();
});
