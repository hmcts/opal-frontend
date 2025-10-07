import { DataTable, Then } from '@badeball/cypress-cucumber-preprocessor';

Then('I see the rejected tab has the suffix {string}', (suffix: string) => {
  cy.get('#inputter-rejected-tab-notifications').should('contain.text', suffix);
});

Then('I see the following tabs:', (table: DataTable) => {
  const tabs = table.raw().flat(); // e.g. [ 'Fines', 'Confiscation' ]
  tabs.forEach((tabText) => {
    cy.contains('a', tabText).should('be.visible');
  });
});
