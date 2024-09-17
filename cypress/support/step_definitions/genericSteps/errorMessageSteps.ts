import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I see the error message {string} at the top of the page', (errorMessage: string) => {
  cy.get('.govuk-error-summary').should('contain', errorMessage);
});
Then('I see the error message {string} above the {string} field', (errorMessage: string, fieldName: string) => {
  cy.contains('.govuk-error-message', errorMessage).siblings().find('label').should('contain', fieldName);
});
Then('I see the error message {string} above the {string} payment field', (errorMessage: string, fieldName: string) => {
  cy.contains('.govuk-error-message', errorMessage).prev().should('contain', fieldName);
});
Then('I see the error message {string} above the Date of birth field', (errorMessage: string) => {
  cy.contains('.govuk-error-message', errorMessage).siblings('label').should('contain', 'Date of birth');
});
Then(
  'I see the error message {string} above the {string} radio button',
  (errorMessage: string, radioButton: string) => {
    cy.contains('.govuk-radios', radioButton).prev().should('contain', errorMessage);
  },
);
