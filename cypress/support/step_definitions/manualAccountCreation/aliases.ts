import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { SrvRecord } from 'dns';

Then('I select the add aliases checkbox', () => {
  cy.get('[data-cy=add-aliases-checkbox]').click();
});
/*
Example usage: I set the "Alias 1", "First name" to "John"
              replace Alias 1 with any of the other aliases 2,3,4 etc
              replace First name with any of the other fields (e.g. Last name)
              replace John with the value you want to enter
*/

Then('I set the {string}, {string} to {string}', (alias: string, aliasField: string, aliasValue: string) => {
  cy.contains('legend', alias)
    .siblings()
    .contains('app-govuk-text-input', aliasField)
    .find('input')
    .clear()
    .type(aliasValue);
});
/*
Example usage: I see "Alias 1", "First name" is set to "John"
              replace Alias 1 with any of the other aliases 2,3,4 etc
              replace First name with any of the other fields (e.g. Last name)
              replace John with the value you expect to see
*/
Then('I see {string}, {string} is set to {string}', (alias: string, aliasField: string, aliasValue: string) => {
  cy.contains('legend', alias)
    .siblings()
    .contains('app-govuk-text-input', aliasField)
    .find('input')
    .should('have.value', aliasValue);
});

//Example usage: I see the "Remove" link below the "Alias 1", "Last name" input
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
Then('I do not see the {string} link below the {string}', (linkName: string, alias: string) => {
  cy.contains('legend', alias).parent().next().contains('a', linkName).should('not.exist', linkName);
});

//Example usage: I do not see the "Remove" link below the "Alias 1", "Last name" input
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
// Then(
//   'I see the {string} link below the {string}, {string} input',
//   (removeLink: string, aliasField: string, lastNameAlias: string) => {
//     cy.contains('a', removeLink)
//       .siblings()
//       .contains('app-govuk-text-input', aliasField)
//       .parent()
//       .next()
//       .contains('a', lastNameAlias)
//       .should('exist');
//   },
// );

Then('I see {string} button below the {string} link', (addAnotherAliasButton: string, removeLink: string) => {
  cy.contains('a', removeLink)
    .parent()
    .siblings()
    .contains('#addAlias', addAnotherAliasButton)
    .should('have.text', addAnotherAliasButton);
});
Then(
  'I see data entered in {string},{string} and {string}',
  (alias: string, aliasField: string, aliasValue: string) => {
    cy.contains('legend', alias)
      .siblings()
      .contains('app-govuk-text-input', aliasField)
      .find('input')
      .should('have.value', aliasValue);
  },
);
Then('I see the text box {string} below the sub heading {string}', (aliasField: string, alias: string) => {
  cy.contains('legend', alias).siblings().contains('app-govuk-text-input', aliasField).should('exist', aliasField);
});

Then('I do not see {string} below the {string} checkbox', (aliasField: string, checkbox: string) => {
  cy.contains('label', checkbox).siblings().contains('', aliasField).should('have.not.exist', aliasField);
});

Then(
  'I select {string} link below the {string}, {string} input',
  (removeLink: string, alias: string, aliasField: string) => {
    cy.contains('legend', alias)
      .siblings()
      .contains('app-govuk-text-input', aliasField)
      .parent()
      .next()
      .contains('a', removeLink)
      .click();
  },
);
Then('I see {string} button', (buttonName: string) => {
  cy.contains('button', buttonName).should('exist', buttonName);
});
