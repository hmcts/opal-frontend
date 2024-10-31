import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { generateString } from '../../../support/utils/stringUtils';

Then('I enter more than 30 characters into the {string} field', (fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false })
    .find('input')
    .clear()
    .type('Test'.repeat(10), { delay: 0 });
});
Then('I enter {int} alphanumeric characters into the {string} field', (numChars: number, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false })
    .find('input')
    .clear()
    .type(generateString(numChars), { delay: 0 });
});
Then('I enter {string} into the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').clear().type(value, { delay: 0 });
});

Then('I enter {string} into the {string} text field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-area', fieldName, { matchCase: false })
    .find('textarea')
    .clear()
    .type(value, { delay: 0 });
});

Then('I enter {string} into the {string} payment field', (value: string, fieldName: string) => {
  cy.contains('.govuk-form-group', fieldName, { matchCase: false }).find('input').clear().type(value, { delay: 0 });
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
    cy.contains('app-govuk-text-area', inputField).find('textarea').clear().type(textToEnter);
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
      .type(value, { delay: 0 });
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
  (offenceCode: string, dataTable: any) => {
    const expectedRows = dataTable.raw();

    cy.get('span.govuk-caption-m')
      .contains(offenceCode)
      .parentsUntil('app-fines-mac-offence-details-review-summary-offence')
      .parent()
      .next()
      .within(() => {
        cy.get('thead th').each((header, headerIndex) => {
          cy.wrap(header).should('contain.text', expectedRows[0][headerIndex].trim());
        });

        cy.get('tbody tr').each((row, rowIndex) => {
          cy.wrap(row)
            .invoke('attr', 'class')
            .then((className) => {
              const isLastRow = className ? className.includes('light-grey-background-color') : false;

              if (isLastRow) {
                expectedRows[rowIndex + 1].forEach((expectedValue: string, colIndex: number) => {
                  cy.wrap(row).within(() => {
                    cy.get('th').eq(colIndex).should('contain.text', expectedValue.trim());
                  });
                });
              } else {
                cy.wrap(row).within(() => {
                  expectedRows[rowIndex + 1].forEach((expectedValue: string, colIndex: number) => {
                    cy.get('td').eq(colIndex).should('contain.text', expectedValue.trim());
                  });
                });
              }
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
