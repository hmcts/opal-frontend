import { Given } from '@badeball/cypress-cucumber-preprocessor';

Given('I intercept the PATCH request for a draft account to ensure it returns a 400 error', () => {
  cy.intercept('PATCH', '/opal-fines-service/draft-accounts/*', {
    statusCode: 400,
    body: {
      error: 'Bad Request',
      message: 'Invalid request data',
    },
  }).as('patchDraftAccountError');
});
