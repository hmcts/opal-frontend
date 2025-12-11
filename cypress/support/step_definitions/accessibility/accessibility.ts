import { Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import 'cypress-axe';

Then('I check accessibility', () => {
  cy.injectAxe();
  cy.checkA11y(undefined, undefined, (violations) => {
    if (violations.length) {
      for (const violation of violations) {
        console.log(`${violation.id} (${violation.impact}): ${violation.description}`);
        for (const node of violation.nodes) {
          console.log('Element:', node.target);
          console.log('Failure Summary:', node.failureSummary);
        }
      }
      assert.fail(`${violations.length} accessibility violation(s) detected.`);
    }
  });
});

// Only use for accessibility testing
Then('I navigate to {string} URL', (url: string) => {
  cy.visit(url);
});

Then('I navigate to each URL in the datatable and check accessibility', (dataTable: DataTable) => {
  const pages = dataTable.hashes();
  for (const row of pages) {
    const url = row['url'];
    const header = row['header'];
    cy.visit(url);
    cy.get('.govuk-heading-l').should('be.visible').and('contain', header);
    cy.injectAxe();
    cy.checkA11y();
  }
});
