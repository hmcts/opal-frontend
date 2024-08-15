import { When } from '@badeball/cypress-cucumber-preprocessor';

When('I attempt to get back to the dashboard by changing the url', () => {
  cy.visit('/dashboard');
});
When('I attempt to get back to the manual account creation, create account screen by changing the url', () => {
  cy.visit('/fines/manual-account-creation/create-account');
});
