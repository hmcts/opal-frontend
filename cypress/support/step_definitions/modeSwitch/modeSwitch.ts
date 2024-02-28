import { AfterAll, BeforeAll } from '@badeball/cypress-cucumber-preprocessor';

BeforeAll(() => {
  if (Cypress.env('TEST_MODE') == 'OPAL') {
    cy.request('PUT', Cypress.env('API_URL') + '/api/testing-support/app-mode', { mode: 'opal' });
  }
  if (Cypress.env('TEST_MODE') == 'LEGACY') {
    cy.request('PUT', Cypress.env('API_URL') + '/api/testing-support/app-mode', { mode: 'legacy' });
  }
});

AfterAll(() => {
  cy.request('PUT', Cypress.env('API_URL') + '/api/testing-support/app-mode', { mode: 'opal' });
});
