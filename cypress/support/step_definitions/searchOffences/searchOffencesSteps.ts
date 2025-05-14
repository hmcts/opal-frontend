import { DataTable, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('I see {string} in the {string} column', (value: string, columnName: string) => {
  cy.get(`td[opal-lib-moj-sortable-table-row-data][id="${columnName}"]`)
    .should('exist')
    .then($cells => {
      const found = Cypress.$.makeArray($cells).some(cell => 
        cell.textContent?.trim().includes(value) || false
      );
      expect(found, `Expected to find "${value}" in the "${columnName}" column`).to.be.true;
    });
});


Then('I see {string} in the Search results table in the {string} column', (expectedText: string, columnName: string) => {
    cy.get('opal-lib-moj-sortable-table')
      .within(() => {
        cy.get('th[opal-lib-moj-sortable-table-header]')
          .filter(`:contains("${columnName}")`)
          .invoke('index')
          .then((columnIndex) => {
            cy.get('tr td:nth-child(' + (columnIndex + 1) + ')')
              .should('exist')
              .then($cells => {
                const found = Cypress.$.makeArray($cells).some(cell => {
                  const paragraphs = cell.querySelectorAll('p');
                  if (paragraphs.length > 0) {
                    return Array.from(paragraphs).some(p => 
                      p.textContent?.trim() === expectedText || false
                    );
                  } else {
                    return cell.textContent?.trim().includes(expectedText) || false;
                  }
                });
                expect(found, `Expected to find "${expectedText}" in the "${columnName}" column`).to.be.true;
              });
          });
      });
  });

