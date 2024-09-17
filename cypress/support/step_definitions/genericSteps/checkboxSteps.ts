import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I select the {string} checkbox', (checkbox: string) => {
  cy.contains('label', checkbox).click();
});
When('I unselect the {string} checkbox', (checkbox: string) => {
  cy.contains('label', checkbox).siblings('input').uncheck();
});
Then('I do not see the {string} checkbox', (checkbox: string) => {
  cy.contains('label', checkbox).should('not.exist');
});
Then('I validate the {string} checkbox is checked', (checkbox: string) => {
  cy.get('input[type="checkbox"]').next().contains('label', checkbox).prev().should('be.checked');
});
Then('I validate the {string} checkbox is not checked', (checkbox: string) => {
  cy.get('input[type="checkbox"]').next().contains('label', checkbox).prev().should('not.be.checked');
});
