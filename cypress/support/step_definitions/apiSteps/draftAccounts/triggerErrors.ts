import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

const globalErrorBannerText =
  'An error has occurred. Please try again, if this problem persists, contact the help desk.';

Given(
  'I click the Manual account creation link and trigger a {int} error for the get businessUnits API',
  (statusCode: number) => {
    cy.intercept('GET', '/opal-fines-service/business-units**', {
      statusCode: statusCode,
      body: { error: 'Internal Server Error' },
    }).as('getBusinessUnitsError');
    cy.get('a').contains('Manual Account Creation').click();
    cy.wait('@getBusinessUnitsError');
  },
);
Then('I should see the global error banner', () => {
  cy.get('opal-lib-moj-banner').should('exist').and('contain.text', globalErrorBannerText);
});

Then('I should not see the global error banner', () => {
  cy.get('opal-lib-moj-banner').should('not.exist');
});
