import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I see the heading under the fine radio button is {string}', (businessUnitHeading: string) => {
  cy.get('.govuk-radios')
    .contains('Fine')
    .parent()
    .siblings('[id="radio-conditional"]')
    .should('contains.text', businessUnitHeading);
});

Then('I see the heading under the fixed penalty radio button is {string}', (businessUnitHeading: string) => {
  cy.get('.govuk-radios')
    .contains('Fixed Penalty')
    .parent()
    .siblings('[id="radio-conditional"]')
    .should('contains.text', businessUnitHeading);
});
