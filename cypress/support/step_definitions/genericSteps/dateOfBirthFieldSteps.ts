import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { calculateDOB } from 'cypress/support/utils/dateUtils';

Then('I see {string} in the Date of birth field', (dob: string) => {
  cy.get('app-moj-date-picker[labeltext="Date of birth"]').find('input').should('have.value', dob);
});
Then('I enter {string} into the Date of birth field', (dob: string) => {
  cy.get('app-moj-date-picker[labeltext="Date of birth"]').find('input').clear().type(dob);
});

Then('I enter a date of birth {int} years ago', (yearsAgo: number) => {
  const dob = calculateDOB(yearsAgo);
  cy.get('app-moj-date-picker[labeltext="Date of birth"]').find('input').clear().type(dob);
});

Then('I see {string} in the date of birth panel', (expectedText: string) => {
  cy.get('app-moj-ticket-panel').find('p').should('contain.text', expectedText);
});

Then('I see age {int} in the date of birth panel', (age: number) => {
  cy.get('app-moj-ticket-panel').find('strong').should('contain.text', age);
});
