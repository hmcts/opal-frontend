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
  'the character remaining is {int} for the {string} input field and I see {string} {string}',
  (expectedRemaining: number, inputField: string, message1: string, message2: string) => {
    const expectedText = message1 + " " + expectedRemaining + " " + message2;
    cy.get('app-govuk-text-area[labeltext="' + inputField + '"]')
      .find('.govuk-hint')
      .should('contain.text', expectedText);
  },
);
