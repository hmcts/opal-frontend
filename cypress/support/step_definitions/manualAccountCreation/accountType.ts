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

Then('I see {string} above the {string} heading', (businessUnitText: string, headingName: string) => {
  cy.get('#AccountType')
    .should('contain.text', headingName)
    .parent()
    .parent()
    .parent()
    .find('p')
    .should('have.text', businessUnitText);
});

Then('I see the {string} radio button below the defendant type help text', (radioButton: string) => {
  cy.get('legend').contains('Defendant type').next().next().contains('label', radioButton);
});
