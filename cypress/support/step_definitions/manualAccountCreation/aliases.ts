import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor/';

Then('I select the add aliases checkbox', () => {
  cy.get('[data-cy=add-aliases-checkbox]').click();
});
Then('I set the {string}, {string} to {string}', (alias: string, aliasField: string, aliasValue: string) => {
  cy.contains('legend', alias).siblings().contains('app-govuk-text-input', aliasField).find('input').type(aliasValue);
});
Then('I see {string}, {string} is set to {string}', (alias: string, aliasField: string, aliasValue: string) => {
  cy.contains('legend', alias)
    .siblings()
    .contains('app-govuk-text-input', aliasField)
    .find('input')
    .should('have.value', aliasValue);
});
Then(
  'I see the {string} link below the {string}, {string} input',
  (linkName: string, alias: string, aliasField: string) => {
    cy.contains('legend', alias)
      .siblings()
      .contains('app-govuk-text-input', aliasField)
      .parent()
      .next()
      .contains('a', linkName);
  },
);
Then(
  'I do not see the {string} link below the {string}, {string} input',
  (linkName: string, alias: string, aliasField: string) => {
    cy.contains('legend', alias)
      .siblings()
      .contains('app-govuk-text-input', aliasField)
      .parent()
      .next()
      .contains('a', linkName)
      .should('not.exist');
  },
);
