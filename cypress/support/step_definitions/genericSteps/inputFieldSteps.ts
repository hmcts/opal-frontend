import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { generateString } from '../../../support/utils/stringUtils';

Then('I enter more than 30 characters into the {string} field', (fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false })
    .find('input')
    .clear()
    .type('Test'.repeat(10), { delay: 10 });
});
Then('I enter {int} alphanumeric characters into the {string} field', (numChars: number, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false })
    .find('input')
    .clear()
    .type(generateString(numChars), { delay: 10 });
});
Then('I enter {string} into the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').clear().type(value, { delay: 10 });
});
Then('I clear the {string} field', (fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').clear();
});

Then('I enter {string} into the {string} text field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-area', fieldName, { matchCase: false })
    .find('textarea')
    .clear()
    .type(value, { delay: 10 });
});

Then('I enter {string} into the {string} payment field', (value: string, fieldName: string) => {
  cy.contains('.govuk-form-group', fieldName, { matchCase: false }).find('input').clear().type(value, { delay: 10 });
});

Then('I see {string} in the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').should('have.value', value);
});

Then('I see {string} in the {string} text field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-area', fieldName, { matchCase: false }).find('textarea').should('have.value', value);
});

Then('I see {string} in the {string} payment field', (value: string, fieldName: string) => {
  cy.contains('.govuk-form-group', fieldName, { matchCase: false }).find('input').should('have.value', value);
});

When('I see {string} under the {string} field', (text: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName).find('input').prev().invoke('text').should('contains', text);
});

Then(
  'the characters remaining counter should show {int} after entering {int} characters into the {string} input field',
  (expectedRemaining: number, numCharsEntered: number, inputField: string) => {
    const textToEnter = generateString(numCharsEntered);
    cy.contains('app-govuk-text-area', inputField).find('textarea').clear().type(textToEnter, { delay: 10 });
    cy.get('.govuk-hint').should('contain.text', expectedRemaining.toString());
  },
);
Then(
  'the character remaining should show {int} for the {string} input field',
  (expectedRemaining: number, inputField: string) => {
    cy.get('app-govuk-text-area[labeltext="' + inputField + '"]')
      .find('.govuk-hint')
      .should('contain.text', expectedRemaining.toString());
  },
);

Then(
  'I enter {string} into the {string} field for imposition {int}',
  (value: string, labelText: string, index: number) => {
    cy.contains('legend', 'Impositions')
      .parent()
      .find('app-moj-ticket-panel')
      .eq(index - 1)
      .contains('label', labelText)
      .nextUntil('input')
      .type(value, { delay: 10 });
  },
);
Then('I clear the {string} field for imposition {int}', (labelText: string, index: number) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('app-moj-ticket-panel')
    .eq(index - 1)
    .contains('label', labelText)
    .nextUntil('input')
    .clear();
});

Then('I see {string} in the {string} field for imposition {int}', (value: string, labelText: string, index: number) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('app-moj-ticket-panel')
    .eq(index - 1)
    .contains('label', labelText)
    .nextUntil('input')
    .find('input')
    .should('have.value', value);
});

Then('I see {string} link for imposition {int}', (labelText: string, index: number) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('app-moj-ticket-panel')
    .eq(index - 1)
    .contains(labelText);
});

//Below step may need it's own .ts file, maybe table related

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
      .parentsUntil('app-fines-mac-offence-details-review-summary-offence')
      .parent()
      .next()
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
