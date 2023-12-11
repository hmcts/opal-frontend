import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor/';

Given('I am on the OPAL Frontend', () => {
  cy.visit('/sign-in');
  cy.wait(500);
});

Then('I see {string} in the header', (header) => {
  cy.get('.govuk-header__content > .govuk-header__link').should('contain', header);
});
When('I click the link in the footer', () => {
  cy.get('.govuk-footer__licence-description > .govuk-footer__link').click();
});

When('I click Sign in', () => {
  cy.get('app-govuk-button > #fetch-api-data').contains('Sign in').click();
});

Then('The sign out link should be visible', () => {
  cy.get('.govuk-link').contains('Sign out').should('be.visible');
});

Then('I see {string} in the page body header', (bodyHeader) => {
  cy.get('.govuk-fieldset__heading').should('contain', bodyHeader);
});

When('I click the Sign out link', () => {
  cy.get('.govuk-link').contains('Sign out').click();
});
