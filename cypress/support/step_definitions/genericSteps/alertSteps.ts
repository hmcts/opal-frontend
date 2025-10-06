import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I click Cancel, a window pops up and I click Ok', () => {
  cy.contains('a', 'Cancel').click();
  cy.once('window:confirm', () => true);
});

Then('I click Cancel, a window pops up and I click Cancel', () => {
  cy.contains('a', 'Cancel').click();
  cy.once('window:confirm', () => false);
});

Then('I click {string}, a window pops up and I click Ok', (link: string) => {
  cy.contains('a', link).click();
  cy.on('window:alert', () => {});
});

Then('I click {string}, a window pops up and I click Cancel', (link: string) => {
  cy.contains('a', link).click();
  cy.once('window:alert', () => {
    return false;
  });
  cy.once('window:confirm', () => {
    return false;
  });
});

Then('I click the browser back button, a window pops up and I click Ok', (link: string) => {
  cy.go('back');
  cy.on('window:alert', () => {});
});

Then('I click the browser back button, a window pops up and I click Cancel', (link: string) => {
  cy.go('back');
  cy.on('window:alert', () => {
    return false;
  });
  cy.on('window:confirm', () => {
    return false;
  });
});

Then('I click the browser back button {int} times, a window pops up and I click Ok', (numberOfBack: number) => {
  // Justification for not using something like:   cy.go(-numberOfBack);
  // reason being that the above does not go to each page, it goes back directly to the page X pages back
  for (let i = 0; i < numberOfBack; i++) {
    cy.go('back');
  }
  cy.on('window:alert', () => {});
});

Then('I click the browser back button {int} times, a window pops up and I click Cancel', (numberOfBack: number) => {
  // Justification for not using something like:   cy.go(-numberOfBack);
  // reason being that the above does not go to each page, it goes back directly to the page X pages back
  for (let i = 0; i < numberOfBack; i++) {
    cy.go('back');
  }
  cy.on('window:alert', () => {
    return false;
  });
  cy.on('window:confirm', () => {
    return false;
  });
});

Then('I verify {string} a window pops up and I click Ok', (link: string) => {
  cy.on('window:confirm', (str) => {
    expect(str).to.equal(link);
  });
});
