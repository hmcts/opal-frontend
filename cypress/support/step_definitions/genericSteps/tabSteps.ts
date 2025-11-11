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

Then('I select the {string} tab', (tabName: string) => {
  cy.contains('a.govuk-tabs__tab', tabName, { matchCase: false }).should('be.visible').click();

  cy.contains('li.govuk-tabs__list-item', tabName).should('have.class', 'govuk-tabs__list-item--selected');
});
