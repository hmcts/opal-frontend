import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I click the {string} button and see {string} on the page header', (buttonName: string, bodyHeader: string) => {
  switch (buttonName) {
    case 'Return to account details': {
      cy.contains('button', buttonName).click();
      cy.get('h1').should('contain', bodyHeader);
      break;
    }
    case 'Add employer details': {
      cy.contains('button', buttonName).click();
      cy.get('h1').should('contain', bodyHeader);
      cy.get('a').contains('Cancel').click();
      break;
    }
    case 'Add contact details': {
      cy.contains('button', buttonName).click();
      cy.get('h1').should('contain', bodyHeader);
      cy.get('a').contains('Cancel').click();
      break;
    }
  }
});
Then('I click the {string} button', (buttonName: string) => {
  cy.contains('button', buttonName).click();
});
Then(
  'I see the {string} radio button below the {string} radio button',
  (radioButton: string, previousRadioButton: string) => {
    cy.contains('label', previousRadioButton).parent().next().contains('label', radioButton);
  },
);
Then('I select the {string} radio button', (radioButton: string) => {
  cy.contains('label', radioButton).click();
});
Then('I validate the {string} radio button is selected', (radioButton: string) => {
  cy.get('input[type="radio"]').next().contains('label', radioButton).prev().should('be.checked');
});
Then('I validate the {string} radio button is not selected', (radioButton: string) => {
  cy.get('input[type="radio"]').next().contains('label', radioButton).prev().should('not.be.checked');
});
Then('I go back in the browser', () => {
  cy.go('back');
});
Then('I select the {string} checkbox', (checkbox: string) => {
  cy.contains('label', checkbox).click();
});
When('I unselect the {string} checkbox', (checkbox: string) => {
  cy.contains('label', checkbox).siblings('input').uncheck();
});
Then('I see the {string} section heading', (sectionName: string) => {
  cy.contains('h2', sectionName);
});
Then('I see the {string} link under the {string} section', (linkName: string, sectionName: string) => {
  cy.contains('h2', sectionName).next().contains('a', linkName);
});
Then('I see the {string} text under the {string} section', (text: string, sectionName: string) => {
  cy.contains('h2', sectionName).next().contains('p', text);
});
Then('I see the {string} button under the {string} section', (buttonName: string, sectionName: string) => {
  cy.contains('h2', sectionName).next().next().contains('button', buttonName);
});
Then('I see the {string} link', (linkName: string) => {
  cy.contains('a', linkName);
});
Then('I do not see a back button or back link', () => {
  cy.contains('a', /back/i).should('not.exist');
  cy.contains('button', /back/i).should('not.exist');
});
Then('I enter more than 30 characters into the {string} field', (fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').clear().type('Test'.repeat(10));
});
Then('I see the error message {string} at the top of the page', (errorMessage: string) => {
  cy.get('.govuk-error-summary').should('contain', errorMessage);
});
Then('I see the error message {string} above the {string} field', (errorMessage: string, fieldName: string) => {
  cy.contains('.govuk-error-message', errorMessage).siblings().find('label').should('contain', fieldName);
});
Then('I see the error message {string} above the Date of birth field', (errorMessage: string) => {
  cy.contains('.govuk-error-message', errorMessage).siblings('label').should('contain', 'Date of birth');
});
Then('I enter {string} into the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').clear().type(value);
});
Then('I enter {string} into the Date of birth field', (dob: string) => {
  cy.get('app-scotgov-date-picker').find('input').clear().type(dob);
});
Then('I see {string} in the {string} field', (value: string, fieldName: string) => {
  cy.contains('app-govuk-text-input', fieldName, { matchCase: false }).find('input').should('have.value', value);
});
Then('I see {string} in the Date of birth field', (dob: string) => {
  cy.get('app-scotgov-date-picker').find('input').should('have.value', dob);
});
Then('I select {string} from the {string} dropdown', (option: string, dropdown: string) => {
  cy.contains('app-govuk-select', dropdown, { matchCase: false }).find('select').select(option);
});
Then('I see {string} selected in the {string} dropdown', (option: string, dropdown: string) => {
  cy.contains('app-govuk-select', dropdown, { matchCase: false }).find('select').should('have.value', option);
});
