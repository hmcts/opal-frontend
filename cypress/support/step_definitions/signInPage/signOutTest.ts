import { When, Then } from '@badeball/cypress-cucumber-preprocessor/';

When('I attempt to get back to the account enquiry search screen by changing the url', () => {
  cy.visit('/account-enquiry/search');
});
When('I attempt to get back to the account enquiry matches screen by changing the url', () => {
  cy.visit('/account-enquiry/matches');
});
Then('I do not see {string} in the header', (header) => {
  cy.get('.h1.govuk-fieldset__heading').should('not.contain', header);
});
