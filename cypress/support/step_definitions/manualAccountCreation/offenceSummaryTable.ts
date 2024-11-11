import { Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';

Then('row number {int} should have the following data:', (rowNumber: number, dataTable: any) => {
  const expectedValues = dataTable.raw();

  const columnNames = expectedValues[0];
  const rowData = expectedValues[1];

  cy.get('app-govuk-table').within(() => {
    columnNames.forEach((columnName: string, colIndex: number) => {
      cy.get('th')
        .contains(columnName)
        .invoke('index')
        .then((colIndexInTable) => {
          cy.get(`tbody tr`)
            .eq(rowNumber - 1)
            .find('td')
            .eq(colIndexInTable)
            .invoke('text')
            .then((text) => text.replace(/\u00a0/g, ' ').trim())
            .should('equal', rowData[colIndex]);
        });
    });
  });
});

Then(
  'the table with offence code {string} should contain the following data:',
  (offenceCode: string, dataTable: DataTable) => {
    // Extract expected rows from the data table
    const expectedRows = dataTable.raw();

    // Locate the table by finding the offence code in the caption
    cy.get('span.govuk-caption-m')
      .contains(offenceCode)
      .parentsUntil('app-fines-mac-offence-details-review-offence')
      .parent()
      .next('app-fines-mac-offence-details-review-offence-imposition')
      .within(() => {
        // Verify table headers
        cy.get('thead th').each((header, headerIndex) => {
          // Check if each header matches the expected header text
          cy.wrap(header).should('contain.text', expectedRows[0][headerIndex].trim());
        });

        // Verify table rows
        cy.get('tbody tr').each((row, rowIndex) => {
          // Get the expected data for the current row
          const expectedRowData = expectedRows[rowIndex + 1];
          cy.wrap(row).within(() => {
            // Verify each cell in the row
            cy.get('td, th').each((cell, colIndex) => {
              // Adjust column index if the row has a specific class
              if (row.hasClass('govuk-light-grey-background-color')) {
                if (colIndex >= 1 && colIndex <= 3) {
                  colIndex += 1;
                }
              }
              // Check if each cell matches the expected cell text
              cy.wrap(cell).should('contain.text', expectedRowData[colIndex].trim());
            });
          });
        });
      });
  },
);
Then('I do not see the offence details for offence {string}', (offenceCode: string) => {
  cy.get('app-fines-mac-offence-details-review-offence')
    .contains(offenceCode)
    .find('app-fines-mac-offence-details-review-offence-imposition')
    .should('not.exist');
});
Then('the summary list should contain the following data:', (dataTable: any) => {
  const expectedData: string[][] = dataTable.raw();

  cy.get('h1')
    .contains('Totals')
    .parent()
    .parent()
    .next()
    .children()
    .children()
    .within(() => {
      expectedData.forEach((row: string[], index: number) => {
        const [term, value] = row;

        cy.get('dt').eq(index).should('contain.text', term.trim());
        cy.get('dd').eq(index).should('contain.text', value.trim());
      });
    });
});
Then('I do not see the offence code {string} on the page', (offenceCode: string) => {
  cy.contains('app-fines-mac-offence-details-review-offence', offenceCode).should('not.exist');
});
