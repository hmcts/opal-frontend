import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I click Cancel, a window pops up and I click Ok', () => {
  cy.contains('a', 'Cancel').click();
  cy.on('window:confirm', () => {});
});

Then('I click Cancel, a window pops up and I click Cancel', () => {
  cy.contains('a', 'Cancel').click();
  cy.on('window:confirm', () => {
    return false;
  });
});

Then('I click {string}, a window pops up and I click Ok', (link: string) => {
  cy.contains('a', link).click();
  cy.on('window:alert', () => {});
});

Then('I click {string}, a window pops up and I click Cancel', (link: string) => {
  cy.contains('a', link).click();
  cy.on('window:alert', () => {
    return false;
  });
});
