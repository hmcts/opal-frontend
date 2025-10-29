import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

const globalErrorBannerText =
  'An error has occurred. Please try again, if this problem persists, contact the help desk.';
const globalRetriableWarningBannerText = 'Please try again later or contact the help desk.';

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

Given(
  'I click the Manual account creation link and trigger a {int} retriable error for the get businessUnits API',
  (statusCode: number) => {
    // Mock retriable error response for GET/PATCH/PUT/POST draft-accounts
    cy.intercept(
      {
        method: 'GET',
        url: '/opal-fines-service/business-units**',
      },
      {
        statusCode,
        body: {
          retriable: true,
          title: 'Temporary System Issue',
          detail: 'Please try again later or contact the help desk.',
          operation_id: 'OP12345',
        },
      },
    ).as('getBusinessUnitsError');

    cy.get('button, a').contains('Manual Account Creation').click();

    // Wait for the mocked call
    cy.wait('@getBusinessUnitsError');

    // Verify the intercepted response
    cy.get('@getBusinessUnitsError').then((interception: any) => {
      expect(interception.response.statusCode).to.equal(statusCode);
      expect(interception.response.body.retriable).to.be.true;
      expect(interception.response.body.title).to.equal('Temporary System Issue');
      expect(interception.response.body.detail).to.include('contact the help desk');
      expect(interception.response.body.operation_id).to.equal('OP12345');
    });
  },
);

Then('I should see the retriable global warning banner', () => {
  cy.get('div[opal-lib-moj-alert]', { timeout: 500 })
    .should('exist')
    .and('contain.text', 'Temporary System Issue')
    .and('contain.text', globalRetriableWarningBannerText)
    .and('contain.text', 'OP12345');
});
