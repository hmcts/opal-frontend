import { Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { formatDateString, calculateWeeksInPast } from '../../../support/utils/dateUtils';

Then('row number {int} should have the following data:', (rowNumber: number, dataTable: any) => {
  const expectedValues = dataTable.raw();

  const columnNames = expectedValues[0];
  const rowData = expectedValues[1];

  cy.get('opal-lib-govuk-table').within(() => {
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

Then('I see the offence {string} above the offence {string}', (offenceCode1: string, offenceCode2: string) => {
  cy.get('app-fines-mac-offence-details-review-offence')
    .contains(offenceCode2)
    .parentsUntil('app-fines-mac-offence-details-review-offence')
    .parent('app-fines-mac-offence-details-review-offence')
    .prevAll('app-fines-mac-offence-details-review-offence')
    .should('contain.text', offenceCode1);
});
Then(
  'I see the date of sentence {int} weeks ago above the date of sentence {int} weeks ago',
  (weeks1: number, weeks2: number) => {
    const weeks1Formatted = formatDateString(calculateWeeksInPast(weeks1));
    const weeks2Formatted = formatDateString(calculateWeeksInPast(weeks2));

    cy.get('app-fines-mac-offence-details-review-summary-date-of-sentence')
      .contains(weeks2Formatted)
      .parentsUntil('app-fines-mac-offence-details-review-summary-date-of-sentence')
      .parent()
      .prevAll('app-fines-mac-offence-details-review-summary-date-of-sentence')
      .should('contain.text', weeks1Formatted);
  },
);

Then('the creditor details should contain:', (dataTable: DataTable) => {
  const expectedData = dataTable.rowsHash();
  cy.get('#creditor').should('exist').and('be.visible');

  cy.get('#creditor').within(() => {
    cy.get('dl.govuk-summary-list').within(() => {
      cy.get('div.govuk-summary-list__row').each(($row) => {
        cy.wrap($row).within(() => {
          cy.get('dt.govuk-summary-list__key')
            .invoke('text')
            .then((key) => {
              const expectedValue = expectedData[key.trim()];
              if (expectedValue) {
                cy.get('dd.govuk-summary-list__value')
                  .invoke('text')
                  .then((actualValue) => {
                    const normalizedActual = actualValue.trim();
                    const normalizedExpected = expectedValue.trim();
                    expect(normalizedActual).to.equal(normalizedExpected);
                  });
              }
            });
        });
      });
    });
  });
});
