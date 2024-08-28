import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I enter more than 30 characters into the {string} field', (fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').clear().type('Test'.repeat(10));
});
Then('I enter {string} into the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').clear().type(value);
});

Then('I see {string} in the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').should('have.value', value);
});

When('I see {string} under the {string} field', (text: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName).find('input').prev().invoke('text').should('contains', text);
});
