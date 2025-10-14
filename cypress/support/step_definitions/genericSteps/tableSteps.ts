import { DataTable, Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I see a table with the headings:', (headings: DataTable) => {
  const tableHeadings = headings.raw()[0];
  tableHeadings.forEach((heading: string) => {
    cy.get('th').contains(heading);
  });
});
Then(
  'I see the following data in position {int} of the rejected accounts table:',
  (position: number, data: DataTable) => {
    const tableData = data.raw()[0];
    tableData.forEach((cellData: string, index: number) => {
      cy.log('Cell data: ' + cellData);
      cy.log('Index: ' + index);
      cy.get('tr').eq(position).children('td').eq(index).contains(cellData);
    });
  },
);
Then(
  'I see the following data in position {int} of the approved accounts table:',
  (position: number, data: DataTable) => {
    const tableData = data.raw()[0];
    tableData.forEach((cellData: string, index: number) => {
      cy.log('Cell data: ' + cellData);
      cy.log('Index: ' + index);
      cy.get('tr').eq(position).children('td').eq(index).contains(cellData);
    });
  },
);

Then('I do not see {string} in column {string}', (unexpectedValue: string, columnName: string) => {
  cy.get('table.govuk-table thead th button')
    .contains(columnName)
    .invoke('parent')
    .then(($th) => {
      const colIndex = $th.index();

      cy.get(`table.govuk-table tbody tr td:nth-child(${colIndex + 1})`).then(($cells) => {
        const cellValues = [...$cells].map((el) => el.innerText.trim());

        cy.log(`Checking column "${columnName}" for unexpected value "${unexpectedValue}"`);
        cy.log(`Found values: ${JSON.stringify(cellValues)}`);

        expect(
          cellValues.some((val) => val.includes(unexpectedValue)),
          `Expected NOT to find "${unexpectedValue}" in column "${columnName}", but it was present`,
        ).to.be.false;
      });
    });
});

Then('I see {string} is present in column {string}', (expectedValue: string, columnName: string) => {
  cy.get('table.govuk-table thead th button')
    .contains(columnName)
    .invoke('parent')
    .then(($th) => {
      const colIndex = $th.index();

      cy.get(`table.govuk-table tbody tr td:nth-child(${colIndex + 1})`).then(($cells) => {
        const cellValues = [...$cells].map((el) => el.innerText.trim());
        cy.log(`Column "${columnName}" values: ${JSON.stringify(cellValues)}`);

        expect(
          cellValues.some((val) => val.includes(expectedValue)),
          `Expected "${expectedValue}" to be found in column "${columnName}"`,
        ).to.be.true;
      });
    });
});
