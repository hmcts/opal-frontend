import { When } from '@badeball/cypress-cucumber-preprocessor/';

When('I attempt to get back to the account enquiry search screen by changing the url', () => {
  cy.visit('/account-enquiry/search');
});
When('I attempt to get back to the account enquiry matches screen by changing the url', () => {
  cy.visit('/account-enquiry/matches');
});
