import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I see the error message {string} at the top of the page', (errorMessage: string) => {
  cy.get('.govuk-error-summary').should('contain', errorMessage);
});

Then('I see the error message {string} above the {string} field', (errorMessage: string, fieldName: string) => {
  cy.contains('.govuk-error-message', errorMessage)
    .closest('.govuk-form-group')
    .find('label, h1')
    .should('contain', fieldName);
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

Then('I see the error message {string} above the result code field', (errorMessage: string) => {
  cy.get('opal-lib-alphagov-accessible-autocomplete[labeltext="Result code"]')
    .find('.govuk-error-message')
    .should('contain', errorMessage);
});

Then('I see the error message {string}', (errorMessage: string) => {
  cy.get('p#facc_add_notes-error-message').should('contain', errorMessage);
});
