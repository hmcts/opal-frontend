import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I see {string} in the Date of birth field', (dob: string) => {
  cy.get('app-moj-date-picker').find('input[id="fm_personal_details_dob"]').should('have.value', dob);
});
Then('I enter {string} into the Date of birth field', (dob: string) => {
  cy.get('app-moj-date-picker').find('input[id="fm_personal_details_dob"]').clear().type(dob);
});

Then('I enter a date of birth {int} years ago', (yearsAgo: number) => {
  const dob = calculateDOB(yearsAgo);
  cy.get('app-moj-date-picker').find('input[id="fm_personal_details_dob"]').clear().type(dob);
});

function calculateDOB(yearsAgo: number): string {
  const today = new Date();
  const dob = new Date(today.getFullYear() - yearsAgo, today.getMonth(), today.getDate());

  const day = String(dob.getDate()).padStart(2, '0');
  const month = String(dob.getMonth() + 1).padStart(2, '0');
  const year = dob.getFullYear();

  return `${day}/${month}/${year}`;
}

Then('I see {string} in the date of birth panel', (expectedText: string) => {
  cy.get('app-moj-ticket-panel').find('p').should('contain.text', expectedText);
});

Then('I see age {int} in the date of birth panel', (age: number) => {
  cy.get('app-moj-ticket-panel').find('strong').should('contain.text', age);
});
