import { Then } from '@badeball/cypress-cucumber-preprocessor/';

Then('I navigate to Manual Account Creation', () => {
  cy.get('#manualAccountCreationLink').should('contain', 'Manually Create Account').click();
});

Then('I see {string} on the page header', (bodyHeader) => {
  cy.get(
    '#main-content > app-manual-account-creation > app-account-details > .govuk-grid-row > .govuk-grid-column-two-thirds > h1',
  ).should('contain', bodyHeader);
});
