import { DataTable, When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I click the back button', () => {
  cy.get('#back').click();
});

When('I click the back button link', () => {
  cy.get('[class="govuk-back-link"]').click();
});
Then('I am presented with a result matching', (table: DataTable) => {
  const searchResult = table.rowsHash();
  cy.get('tbody > :nth-child(1) > .cdk-column-name').contains(searchResult['name']);
  cy.get('tbody > :nth-child(1) > .cdk-column-dateOfBirth').contains(searchResult['dateOfBirth']);
  cy.get('tbody > :nth-child(1) > .cdk-column-addressLine1').contains(searchResult['addrLn1']);
});

Then('No results are returned', () => {
  cy.get('app-matches-table > table > tbody').find('tr').should('have.length', 0);
});

Then('I am presented with results all containing', (table: DataTable) => {
  const searchResults = table.rowsHash();
  let numberOfResults: number = 0;

  let index: number = 1;

  cy.get('app-matches-table > table > tbody')
    .find('tr')
    .then((rows) => {
      numberOfResults = rows.length;
      cy.log('number of rows found: ' + numberOfResults);

      while (index <= numberOfResults) {
        resultContains(index, 'name', searchResults['name']);
        resultContains(index, 'dob', searchResults['dateOfBirth']);
        resultContains(index, 'address', searchResults['addrLn1']);
        index++;
      }
    });

  function resultContains(index: number, row: string, value: string) {
    if (value) {
      if (row == 'name') {
        cy.get('tbody > :nth-child(' + index + ') > .cdk-column-name').contains(value);
      }
      if (row == 'dob') {
        cy.get('tbody > :nth-child(' + index + ') > .cdk-column-dateOfBirth').contains(value);
      }
      if (row == 'address') {
        cy.get('tbody > :nth-child(' + index + ') > .cdk-column-addressLine1').contains(value);
      }
    }
  }
});
