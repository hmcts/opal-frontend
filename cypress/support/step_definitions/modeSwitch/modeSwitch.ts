import { AfterAll, BeforeAll } from '@badeball/cypress-cucumber-preprocessor';

function apiUrl() {
  const baseUrl = Cypress.config('baseUrl');
  let url;
  if (baseUrl?.includes('localhost')) {
    url = 'http://localhost:4550';
  }
  if (baseUrl?.includes('staging.staging')) {
    url = 'https://opal-fines-service.staging.platform.hmcts.net';
  } else {
    url = `https://opal-fines-service-${baseUrl.replace('https://', '')}`;
  }
  return url;
}

BeforeAll(() => {
  if (Cypress.env('TEST_MODE') == 'OPAL') {
    cy.request('PUT', apiUrl() + '/api/testing-support/app-mode', { mode: 'opal' });
  }
  if (Cypress.env('TEST_MODE') == 'LEGACY') {
    cy.request('PUT', apiUrl() + '/api/testing-support/app-mode', { mode: 'legacy' });
  }
});

AfterAll(() => {
  cy.request('PUT', apiUrl() + '/api/testing-support/app-mode', { mode: 'opal' });
});
