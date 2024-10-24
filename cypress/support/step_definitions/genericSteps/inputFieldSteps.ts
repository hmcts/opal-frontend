import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I enter more than 30 characters into the {string} field', (fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').clear().type('Test'.repeat(10));
});
Then('I enter {string} into the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').clear().type(value);
});

Then('I enter {string} into the {string} text field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-area', fieldName, { matchCase: false }).find('textarea').clear().type(value);
});

Then('I enter {string} into the {string} payment field', (value: string, fieldName: string) => {
  cy.contains('.govuk-form-group', fieldName, { matchCase: false }).find('input').clear().type(value);
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

function generateString(length: number): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

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
      .type(value);
  },
);

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
