import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then(
  'I see {string} in the Search results table in the {string} column',
  (expectedText: string, columnName: string) => {
    cy.get('opal-lib-moj-sortable-table').within(() => {
      cy.get('th[opal-lib-moj-sortable-table-header]')
        .filter(`:contains("${columnName}")`)
        .invoke('index')
        .then((columnIndex) => {
          cy.get('tr td:nth-child(' + (columnIndex + 1) + ')')
            .should('exist')
            .then(($cells) => {
              const found = Cypress.$.makeArray($cells).some((cell) => {
                const cellText = cell.querySelectorAll('p');
                if (cellText.length > 0) {
                  return Array.from(cellText).some((p) => p.textContent?.trim() === expectedText || false);
                } else {
                  return cell.textContent?.trim().includes(expectedText) || false;
                }
              });
              expect(found, `Expected to find "${expectedText}" in the "${columnName}" column`).to.be.true;
            });
        });
    });
  },
);
