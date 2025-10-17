import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

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
    .closest('fieldset')
    .contains('opal-lib-govuk-text-input', aliasField)
    .find('input')
    .clear()
    .type(aliasValue, { delay: 0 });
});
/*
Example usage: I see "Alias 1", "First name" is set to "John"
              replace Alias 1 with any of the other aliases 2,3,4 etc
              replace First name with any of the other fields (e.g. Last name)
              replace John with the value you expect to see
*/
Then('I see {string}, {string} is set to {string}', (alias: string, aliasField: string, aliasValue: string) => {
  cy.contains('legend', alias)
    .closest('fieldset')
    .contains('opal-lib-govuk-text-input', aliasField)
    .find('input')
    .should('have.value', aliasValue);
});

//Example usage: I see the "Remove" link below the "Alias 1", "Last name" input
Then(
  'I see the {string} link below the {string}, {string} input',
  (linkName: string, alias: string, aliasField: string) => {
    cy.contains('legend', alias)
      .closest('fieldset')
      .contains('opal-lib-govuk-text-input', aliasField)
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
      .closest('fieldset')
      .contains('opal-lib-govuk-text-input', aliasField)
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
//       .closest('fieldset')
//       .contains('opal-lib-govuk-text-input', aliasField)
//       .parent()
//       .next()
//       .contains('a', lastNameAlias)
//       .should('exist');
//   },
// );

Then('I see {string} button below the {string} link', (addAnotherAliasButton: string, removeLink: string) => {
  cy.contains('a', removeLink)
    .parent()
    .closest('fieldset')
    .contains('#addAlias', addAnotherAliasButton)
    .should('have.text', addAnotherAliasButton);
});

When('I remove the {string}, {string} to be cleared', (alias: string, aliasField: string) => {
  cy.contains('legend', alias)
    .closest('fieldset')
    .contains('opal-lib-govuk-text-input', aliasField)
    .find('input')
    .clear();
});
Then('I see the text box {string} below the sub heading {string}', (aliasField: string, alias: string) => {
  cy.contains('legend', alias)
    .closest('fieldset')
    .contains('opal-lib-govuk-text-input', aliasField)
    .should('exist', aliasField);
});

Then('I do not see {string} below the {string} checkbox', (aliasField: string, checkbox: string) => {
  cy.contains('label', checkbox).closest('fieldset').contains('', aliasField).should('have.not.exist', aliasField);
});

Then(
  'I select {string} link below the {string}, {string} input',
  (removeLink: string, alias: string, aliasField: string) => {
    cy.contains('legend', alias)
      .closest('fieldset')
      .contains('opal-lib-govuk-text-input', aliasField)
      .parent()
      .next()
      .contains('a', removeLink)
      .click();
  },
);
Then('I see {string} button', (buttonName: string) => {
  cy.contains('button', buttonName).should('exist', buttonName);
});
When('I select add another alias', () => {
  cy.get('[id*="_details_add_alias-conditional"] > opal-lib-govuk-button > button').click();
});

Then('I see the {string} sub heading in aliases', (aliasText: string) => {
  cy.contains('[id*="_details_add_alias-conditional"] > fieldset > legend', aliasText).invoke('text');
});
Then('I see {string} link below the {string} field', (removeLink: string, lastName: string) => {
  cy.get('[id*="_details_add_alias-conditional"]> fieldset >lib-govuk-text-input > div >h1 ')
    .find('[id*="_details_add_alias-conditional"] >div > a')
    .invoke('text')
    .should('contains', removeLink);
});

Then('I no longer see {string} sub heading', (aliasText: string) => {
  cy.contains('[id*="_details_add_alias-conditional"] > fieldset > legend', aliasText).should('not.exist', aliasText);
});
Then('I verify the {string} text box below the {string} sub heading', (firstName: string, aliasText: string) => {
  cy.contains('[id*="_details_add_alias-conditional"] > fieldset > legend', aliasText)

    .next()
    .contains('h1', firstName)
    .invoke('text')
    .then((firstName) => firstName.replace(' ', '').trim());
});
Then(
  'I verify the {string} text box below the {string} sub heading and first names',
  (lastName: string, aliasText: string) => {
    cy.contains('[id*="_details_add_alias-conditional"] > fieldset > legend', aliasText)
      .next()
      .next()
      .contains('h1', lastName)
      .invoke('text')
      .then((lastName) => lastName.replace(' ', '').trim());
  },
);
Then('I verify the {string} button below the {string}', (removeLink: string, aliasText: string) => {
  cy.contains('[id*="_details_add_alias-conditional"] > fieldset > legend', aliasText)
    .invoke('text')
    .next()
    .contains('h1', 'First names')
    .invoke('text')
    .then((firstName) => firstName.replace(' ', '').trim())
    .next()
    .contains('h1', 'Last name')
    .invoke('text')
    .then((lastName) => lastName.replace(' ', '').trim())
    .prev()
    .contains('[id*="_details_add_alias-conditional"] > div > a', removeLink)
    .invoke('text')
    .should('have.text', removeLink);
});
