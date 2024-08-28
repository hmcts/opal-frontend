import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I see {string} in the Date of birth field', (dob: string) => {
  cy.get('app-scotgov-date-picker').find('input').should('have.value', dob);
});
Then('I enter {string} into the Date of birth field', (dob: string) => {
  cy.get('app-scotgov-date-picker').find('input').clear().type(dob);
});
