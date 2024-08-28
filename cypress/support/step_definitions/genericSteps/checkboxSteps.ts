import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I select the {string} checkbox', (checkbox: string) => {
  cy.contains('label', checkbox).click();
});
When('I unselect the {string} checkbox', (checkbox: string) => {
  cy.contains('label', checkbox).siblings('input').uncheck();
});
