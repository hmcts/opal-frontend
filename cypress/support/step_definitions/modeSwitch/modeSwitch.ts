import { AfterAll, BeforeAll } from '@badeball/cypress-cucumber-preprocessor';

BeforeAll(() => {
  if (Cypress.env('TEST_MODE') == 'OPAL') {
    cy.visit('/');
    cy.request('GET', 'api/testing-support/app-mode');
    cy.request('PUT', 'api/testing-support/app-mode', { mode: 'opal' });
  }
  if (Cypress.env('TEST_MODE') == 'LEGACY') {
    cy.visit('/');
    cy.request('GET', 'api/testing-support/app-mode');
    cy.request('PUT', 'api/testing-support/app-mode', { mode: 'legacy' });
  }
});

AfterAll(() => {
  cy.visit('/');
  cy.request('GET', 'api/testing-support/app-mode');
  cy.request('PUT', 'api/testing-support/app-mode', { mode: 'opal' });
});
