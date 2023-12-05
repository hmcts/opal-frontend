import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor/";

Given("I am on the OPAL Frontend", () => {
  cy.visit("/sign-in")
});

Then('I see {string} in the header', (header) => {
  cy.get(".govuk-header__content > .govuk-header__link").should('contain', header)
});

When("I click Sign in", () => {
  cy.get('app-govuk-button > #fetch-api-data').contains('Sign in').click
});

Then("The sign out button should be visible", () => {
  cy.get('app-govuk-button > #fetch-api-data').contains('Sign out').should('be.visible')
});
