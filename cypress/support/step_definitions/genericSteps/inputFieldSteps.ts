import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { generateString } from '../../../support/utils/stringUtils';

Then('I enter more than 30 characters into the {string} field', (fieldName: string) => {
  cy.contains('opal-lib-govuk-text-input', fieldName, { matchCase: false })
    .find('input')
    .clear()
    .type('Test'.repeat(10), { delay: 0 });
});
Then('I enter {int} alphanumeric characters into the {string} field', (numChars: number, fieldName: string) => {
  cy.contains('opal-lib-govuk-text-input', fieldName, { matchCase: false })
    .find('input')
    .clear()
    .type(generateString(numChars), { delay: 0 });
});
Then('I enter {int} alphanumeric characters into the {string} text field', (numChars: number, fieldName: string) => {
  cy.contains('opal-lib-govuk-text-area', fieldName, { matchCase: false })
    .find('textarea')
    .clear()
    .type(generateString(numChars), { delay: 0 });
});
Then('I enter {string} into the {string} field', (value: string, fieldName: string) => {
  cy.contains('opal-lib-govuk-text-input', fieldName, { matchCase: false })
    .find('input')
    .clear()
    .type(value, { delay: 0 });
});
Then('I clear the {string} field', (fieldName: string) => {
  cy.contains('opal-lib-govuk-text-input', fieldName, { matchCase: false }).find('input').clear();
});

Then('I enter {string} into the {string} text field', (value: string, fieldName: string) => {
  cy.contains('opal-lib-govuk-text-area', fieldName, { matchCase: false })
    .find('textarea')
    .clear()
    .type(value, { delay: 0 });
});

Then('I clear the {string} text field', (fieldName: string) => {
  cy.contains('opal-lib-govuk-text-area', fieldName, { matchCase: false }).find('textarea').clear();
});

Then('I enter {string} into the {string} payment field', (value: string, fieldName: string) => {
  cy.contains('.govuk-form-group', fieldName, { matchCase: false }).find('input').clear().type(value, { delay: 0 });
});

Then('I see {string} in the {string} field', (value: string, fieldName: string) => {
  cy.contains('opal-lib-govuk-text-input', fieldName, { matchCase: false }).find('input').should('have.value', value);
});

Then('I see {string} in the {string} text field', (value: string, fieldName: string) => {
  cy.contains('opal-lib-govuk-text-area', fieldName, { matchCase: false }).find('textarea').should('have.value', value);
});

Then('I see {string} in the {string} payment field', (value: string, fieldName: string) => {
  cy.contains('.govuk-form-group', fieldName, { matchCase: false }).find('input').should('have.value', value);
});

When('I see {string} under the {string} field', (text: string, fieldName: string) => {
  cy.contains('opal-lib-govuk-text-input', fieldName).find('input').prev().invoke('text').should('contains', text);
});
Then('I see {int} alphanumeric characters in the {string} field', (numChars: number, fieldName: string) => {
  cy.contains('opal-lib-govuk-text-input', fieldName, { matchCase: false })
    .find('input')
    .invoke('val')
    .then((value) => {
      expect(value).to.have.lengthOf(numChars);
    });
});
Then('I see {int} alphanumeric characters in the {string} text field', (numChars: number, fieldName: string) => {
  cy.contains('opal-lib-govuk-text-area', fieldName, { matchCase: false })
    .find('textarea')
    .invoke('val')
    .then((value) => {
      expect(value).to.have.lengthOf(numChars);
    });
});

Then(
  'the characters remaining counter should show {int} after entering {int} characters into the {string} input field',
  (expectedRemaining: number, numCharsEntered: number, inputField: string) => {
    const textToEnter = generateString(numCharsEntered);
    cy.contains('opal-lib-govuk-text-area', inputField).find('textarea').clear().type(textToEnter, { delay: 0 });
    cy.get('.govuk-hint').should('contain.text', expectedRemaining.toString());
  },
);
Then(
  'the character remaining should show {int} for the {string} input field',
  (expectedRemaining: number, inputField: string) => {
    cy.get('opal-lib-govuk-text-area[labeltext="' + inputField + '"]')
      .find('.govuk-hint')
      .should('contain.text', expectedRemaining.toString());
  },
);

Then(
  'I enter {string} into the {string} field for imposition {int}',
  (value: string, labelText: string, index: number) => {
    cy.contains('legend', 'Impositions')
      .parent()
      .find('opal-lib-moj-ticket-panel')
      .eq(index - 1)
      .contains('label', labelText)
      .nextUntil('input')
      .type(value, { delay: 0 });
  },
);
Then('I clear the {string} field for imposition {int}', (labelText: string, index: number) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('opal-lib-moj-ticket-panel')
    .eq(index - 1)
    .contains('label', labelText)
    .nextUntil('input')
    .find('input')
    .clear();
});

Then('I see {string} in the {string} field for imposition {int}', (value: string, labelText: string, index: number) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('opal-lib-moj-ticket-panel')
    .eq(index - 1)
    .contains('label', labelText)
    .nextUntil('input')
    .find('input')
    .should('have.value', value);
});

Then('I see {string} link for imposition {int}', (labelText: string, index: number) => {
  cy.contains('legend', 'Impositions')
    .parent()
    .find('opal-lib-moj-ticket-panel')
    .eq(index - 1)
    .contains(labelText);
});
