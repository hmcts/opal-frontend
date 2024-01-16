import { DataTable, When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I populate the form with the following search criteria', (table: DataTable) => {
  const searchCriteria = table.rowsHash();

  cy.get('#court').select(searchCriteria['court']);

  function typeIfNotBlank(selector: string, value: string) {
    if (value) {
      cy.get(selector).type(value);
    }
  }
  typeIfNotBlank('#surname', searchCriteria['surname']);
  typeIfNotBlank('#forename', searchCriteria['forename']);
  typeIfNotBlank('#initials', searchCriteria['initials']);
  typeIfNotBlank('#dayOfMonth', searchCriteria['dobDay']);
  typeIfNotBlank('#monthOfYear', searchCriteria['dobMonth']);
  typeIfNotBlank('#year', searchCriteria['dobYear']);
  typeIfNotBlank('#addressLineOne', searchCriteria['addrLn1']);
  typeIfNotBlank('#niNumber', searchCriteria['niNumber']);
  typeIfNotBlank('#pcr', searchCriteria['pcr']);
});

Then('I see an Object logged in the console containing', (/*table: DataTable*/) => {
  //const expectedResponse = table.rowsHash()
  //cant get json object from console using cypress
});

When('I see the form contains the following search criteria', (table: DataTable) => {
  const searchCriteria = table.rowsHash();

  if (searchCriteria['court'] != '') {
    cy.get('#court').should('have.value', searchCriteria['court']);
  } else
    () => {
      cy.get('#court').should('have.value', null);
    };

  function assertValueIsCorrect(selector: string, value: string) {
    if (value) {
      cy.get(selector).should('have.value', value);
    } else {
      cy.get(selector).should('have.value', '');
    }
  }
  assertValueIsCorrect('#surname', searchCriteria['surname']);
  assertValueIsCorrect('#forename', searchCriteria['forename']);
  assertValueIsCorrect('#initials', searchCriteria['initials']);
  assertValueIsCorrect('#dayOfMonth', searchCriteria['dobDay']);
  assertValueIsCorrect('#monthOfYear', searchCriteria['dobMonth']);
  assertValueIsCorrect('#year', searchCriteria['dobYear']);
  assertValueIsCorrect('#addressLineOne', searchCriteria['addrLn1']);
  assertValueIsCorrect('#niNumber', searchCriteria['niNumber']);
  assertValueIsCorrect('#pcr', searchCriteria['pcr']);
});

When('I click the clear button', () => {
  cy.get('#clearForm').click();
});

When('I click the search button', () => {
  cy.get('#submitForm').click();
});
