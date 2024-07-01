import { should } from 'chai';
import { arrayBuffer } from 'stream/consumers';

export default class personalDetails {
  static enterFirstNames(firstName: string) {
    cy.get('#firstNames').clear().type(firstName);
  }
  static enterLastName(lastName: string) {
    cy.get('#lastName').clear().type(lastName);
  }
  static enterNINO(nino: string) {
    cy.get('#nationalInsuranceNumber').clear().type(nino);
  }
  static enterPostcode(postcode: string) {
    cy.get('#postcode').clear().type(postcode);
  }
  static selectTitle(title: string) {
    cy.get('select').select(title);
  }
  static enterAddressLine1(addLine1: string) {
    cy.get('#addressLine1').clear().type(addLine1);
  }
  static enterAddressLine2(addLine2: string) {
    cy.get('#addressLine1').find('input').clear().type(addLine2);
  }
  static enterAddressLine3(addLine3: string) {
    cy.get('#addressLine1').find('input').clear().type(addLine3);
  }
  static enterFirstNamesInAlias(firstNameAlias: string) {
    cy.get('#addAlias-conditional > fieldset >legend')
      .siblings()
      .get('#addAlias-conditional > fieldset >app-govuk-text-input > div > input')
      .should('be.visible')
      .type(firstNameAlias);
  }
  static enterLastNamesInAlias(lastNameAlias: string) {
    cy.get('#addAlias-conditional > fieldset >app-govuk-text-input >div>input').type(lastNameAlias);
  }
}


import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor/';

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
  cy.contains('legend', alias).siblings().contains('app-govuk-text-input', aliasField).find('input').type(aliasValue);
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

Then('I see {string} button below the {string} link', (addAnotherAliasButton: string, removeLink: string) => {
  cy.contains('a', removeLink)
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