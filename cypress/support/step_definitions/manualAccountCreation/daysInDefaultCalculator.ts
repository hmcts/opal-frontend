import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I see the text {string} in the days in default section', (text: string) => {
  cy.get('[fieldsetid="daysInDefaultCheckbox"]').should('contain', text);
});

Then('I click on the Help calculate days in default section', () => {
  cy.get('[summarytext="Help calculate days in default"]').find('span').click();
});
Then('I see the Help calculate days in default section is collapsed', () => {
  cy.get('[summarytext="Help calculate days in default"]').children().should('not.have.attr', 'open');
});
Then('I see the Help calculate days in default section is expanded', () => {
  cy.get('[summarytext="Help calculate days in default"]').children().should('have.attr', 'open');
});

Then('I see the error message {string} above the days in default input field', (errorMessage: string) => {
  cy.get('input[id="fm_payment_terms_days_in_default"]')
    .parent()
    .prev('.govuk-error-message')
    .should('contain', errorMessage);
});
When('I enter {string} into the days in default input field', (daysInDefault: string) => {
  cy.get('input[id="fm_payment_terms_days_in_default"]').clear().type(daysInDefault);
});
Then('I see {string} in the days in default input field', (daysInDefault: string) => {
  cy.get('input[id="fm_payment_terms_days_in_default"]').should('have.value', daysInDefault);
});
Then('I enter {string} into the {string} input in the calculator', (value: string, inputField: string) => {
  cy.get('app-fines-mac-default-days').find(`input[id="${inputField}"]`).clear().type(value);
});
Then('I see {string} in the {string} input in the calculator', (value: string, inputField: string) => {
  cy.get('app-fines-mac-default-days').find(`input[id="${inputField}"]`).should('have.value', value);
});
Then('I see the text {string} in the calculator', (text: string) => {
  cy.get('app-fines-mac-default-days').should('contain', text);
});
