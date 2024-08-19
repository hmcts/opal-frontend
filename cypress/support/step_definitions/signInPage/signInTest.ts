import { When, Then, Given } from '@badeball/cypress-cucumber-preprocessor';

Given('I am on the OPAL Frontend', () => {
  cy.visit('/sign-in');
  cy.wait(500);
});

Then('I see an access denied error', () => {
  cy.get('.govuk-heading-l').should('contain.text', 'Access Denied');
});

Then('The error message is {string}', (errorMsg: string) => {
  cy.get('.govuk-grid-column-two-thirds > :nth-child(2)').should('contain.text', errorMsg);
});

Then('There is a button to go back to the dashboard', () => {
  cy.get('#go-back').should('contain.text', 'Back to dashboard');
});

When('I sign in as {string}', (email: string) => {
  const emailSSO = email;
  const passwordSSO = Cypress.env('CYPRESS_TEST_PASSWORD') || '';

  cy.location('href').then((href: string) => {
    cy.log(href);
    if (href.includes('pr-') || href.includes('localhost') || href.includes('staging')) {
      cy.wait(50);
      cy.get('input[type="text"]').type(emailSSO);
      cy.get('#submitForm').click();

      cy.get('.moj-header__navigation-item > .moj-header__navigation-link').contains('Sign out');
    } else {
      cy.get('#signInButton').contains('Sign in').click();

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

          cy.get('input[type="password"]').type(passwordSSO, { log: false });
          cy.get('input[type="submit"]').click();
          cy.get('#idBtn_Back').click();
        },
      );
      cy.wait(500);
      cy.get('.moj-header__navigation-item > .moj-header__navigation-link').contains('Sign out');
    }
  });
});
Then('I am on the dashboard', () => {
  cy.get('#main-content > div > app-dashboard > div > h1').should('contain', 'Dashboard');
});
Then('I navigate to Account Enquiry', () => {
  cy.get('#accountEnquiryLink').should('contain', 'Account Enquiry').click();
});

Then('I see {string} in the header', (header) => {
  cy.get('.moj-header__link--service-name').should('contain', header);
});
When('I click the link in the footer', () => {
  cy.get('.govuk-footer__licence-description > .govuk-footer__link').click();
});

When('I click Sign in', () => {
  cy.get('#signInButton').contains('Sign in').click();
});

Then('The sign out link should be visible', () => {
  cy.get('.moj-header__navigation-item > .moj-header__navigation-link').contains('Sign out').should('be.visible');
});

Then('I see {string} in the page body header', (bodyHeader) => {
  cy.get('.govuk-fieldset__heading').should('contain', bodyHeader);
});
Then('I see {string} on the sign in page', (bodyHeader) => {
  cy.location('href').then((href: string) => {
    if (href.includes('pr-') || href.includes('localhost') || href.includes('staging')) {
      cy.get('.govuk-fieldset__heading').should('contain', bodyHeader);
    } else {
      cy.get('.govuk-heading-m').should('contain', bodyHeader);
    }
  });
});

When('I click the Sign out link', () => {
  cy.get('.moj-header__navigation-item > .moj-header__navigation-link').contains('Sign out').click();
  cy.location('href').then((href: string) => {
    if (href.includes('pr-') || href.includes('localhost') || href.includes('staging')) {
      cy.log('no SSO signing out');
    } else {
      cy.origin('https://login.microsoftonline.com', () => {
        cy.wait(500);
        cy.get('#tilesHolder > div:nth-child(1)').click();
      });
    }
  });
});
