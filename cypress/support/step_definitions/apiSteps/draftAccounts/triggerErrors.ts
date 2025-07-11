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

    cy.get('@getBusinessUnitsError').then((interception: any) => {
      expect(interception.response.statusCode).to.equal(statusCode);
      expect(interception.response.body.error).to.equal('Internal Server Error');
    });
  },
);
Then('I should see the global error banner', () => {
  cy.get('div[opal-lib-moj-alert]', { timeout: 20_000 }).should('exist').and('contain.text', globalErrorBannerText);
});

Then('I should not see the global error banner', () => {
  cy.get('div[opal-lib-moj-alert]').should('not.exist');
});
