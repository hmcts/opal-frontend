import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor/';

Given('I am on the OPAL Frontend', () => {
  cy.visit('/sign-in');
  cy.wait(500);
});

When('I sign in', () => {
  const emailSSO: string = 'opal-test@hmcts.net';
  const passwordSSO: string = 'OpalFinesService1';

  cy.location('href').then((href: string) => {
    if (href.includes('pr-')) {
      cy.get('app-govuk-button > #fetch-api-data').contains('Sign in').click();
      cy.get('.govuk-fieldset__heading').should('contain', 'Account Enquiry');
    } else {
      cy.get('app-govuk-button > #fetch-api-data').contains('Sign in').click();

      cy.origin(
        'https://login.microsoftonline.com',
        {
          args: {
            emailSSO,
            passwordSSO,
          },
        },
        ({ emailSSO, passwordSSO }) => {
          cy.wait(500);
          cy.get('input[type="email"]').type(emailSSO);
          cy.get('input[type="submit"]').click();

          cy.get('input[type="password"]').type(passwordSSO);
          cy.get('input[type="submit"]').click();
          cy.get('#idBtn_Back').click();
        },
      );

      cy.get('.govuk-fieldset__heading').should('contain', 'Account Enquiry');
    }
  });
});

Then('I see {string} in the header', (header) => {
  cy.wait(600000);
  cy.get('.govuk-header__content > .govuk-header__link').should('contain', header);
});
When('I click the link in the footer', () => {
  cy.get('.govuk-footer__licence-description > .govuk-footer__link').click();
});

When('I click Sign in', () => {
  cy.get('app-govuk-button > #fetch-api-data').contains('Sign in').click();
});

Then('The sign out link should be visible', () => {
  cy.get('.govuk-link').contains('Sign out').should('be.visible');
});

Then('I see {string} in the page body header', (bodyHeader) => {
  cy.get('.govuk-fieldset__heading').should('contain', bodyHeader);
});
Then('I see {string} on the sign in page', (bodyHeader) => {
  cy.wait(600000);
  cy.get('.govuk-heading-m').should('contain', bodyHeader);
});

When('I click the Sign out link', () => {
  cy.get('.govuk-link').contains('Sign out').click();
});
