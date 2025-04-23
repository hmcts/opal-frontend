import { AfterAll, BeforeAll } from '@badeball/cypress-cucumber-preprocessor';

function apiUrl() {
  const baseUrl = Cypress.config('baseUrl');
  let url;
  if (baseUrl?.includes('localhost')) {
    url = 'http://localhost:4550';
  } else if (baseUrl?.includes('staging.staging')) {
    url = 'https://opal-fines-service.staging.platform.hmcts.net';
  } else if (baseUrl?.includes('staging')) {
    url = 'https://opal-fines-service.staging.platform.hmcts.net';
  } else {
    url = `https://opal-fines-service-${baseUrl?.replace('https://', '')}`;
  }
  return url;
}
/* 
function checkHealthWithRetry(attemptsLeft = 10) {
  if (attemptsLeft === 0) {
    throw new Error('Maximum number of attempts reached');
  }
  cy.request(apiUrl() + '/health').then((response) => {
    if (response.status === 200 && response.body.status === 'UP') {
      cy.log(response.status.toString());
      cy.log(response.body.status);
      cy.log('Backend Health Good');
    } else {
      cy.log(response.status.toString());
      cy.log(response.body.status);
      cy.wait(2000);
      return checkHealthWithRetry(attemptsLeft - 1);
    }
  });
}*/

BeforeAll(() => {
  if (Cypress.env('TEST_MODE') == 'OPAL') {
    cy.request('PUT', apiUrl() + '/testing-support/app-mode', { mode: 'opal' });
  }
  if (Cypress.env('TEST_MODE') == 'LEGACY') {
    cy.request('PUT', apiUrl() + '/testing-support/app-mode', { mode: 'legacy' });
  }
});

AfterAll(() => {
  cy.request('PUT', apiUrl() + '/testing-support/app-mode', { mode: 'opal' });
});
