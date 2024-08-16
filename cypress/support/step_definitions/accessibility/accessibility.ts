import { Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import 'cypress-axe';

Then('I check accessibility', () => {
  cy.injectAxe();
  cy.checkA11y();
});
//Only use for accessibility testing
Then('I navigate to {string} URL', (url: string) => {
  cy.visit(url);
});
Then('I navigate to each URL in the datatable and check accessibility', (dataTable: DataTable) => {
  const pages = dataTable.hashes();
  pages.forEach((row: any) => {
    const url = row['url'];
    const header = row['header'];
    cy.visit(url);
    cy.get('.govuk-heading-l').should('be.visible').should('contain', header);
    cy.injectAxe();
    cy.checkA11y();
  });
});
