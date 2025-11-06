// cypress/e2e/functional/opal/actions/login.actions.ts
import * as Locators from '../../../../shared/selectors/login.locators';

/**
 * Performs the full login flow:
 * - Handles local login (PR/localhost)
 * - Handles Microsoft SSO login when redirected
 * - Uses cy.session to cache sessions for each email (faster pipelines)
 * @param email - The email address of the user to log in
 */
export function performLogin(email: string): void {
  const password = Cypress.env('CYPRESS_TEST_PASSWORD') || '';

  Cypress.log({
    name: 'auth',
    displayName: 'Login',
    message: `Logging in as ${email}`,
  });

  cy.session(
    email,
    () => {
      cy.visit('/');
      cy.location('href').then((href) => {
        if (href.includes('pr-') || href.includes('localhost')) {
          // ----- Local or PR environment -----
          cy.wait(50);
          cy.get(Locators.usernameInput).type(email, { delay: 0 });
          cy.get(Locators.submitBtn).click();

          // Verify login success
          cy.get('.moj-header__navigation-item > .moj-header__navigation-link').contains('Sign out').should('exist');
        } else {
          // ----- Microsoft SSO -----
          cy.origin('https://login.microsoftonline.com', { args: { email, password } }, ({ email, password }) => {
            cy.wait(500);
            cy.get('input[type="email"]', { timeout: 12000 }).type(email, { delay: 0 });
            cy.get('input[type="submit"]').click();
            cy.get('input[type="password"]', { timeout: 12000 }).type(password, {
              log: false,
              delay: 0,
            });
            cy.get('input[type="submit"]').click();
            cy.get('#idBtn_Back', { timeout: 12000 }).click();
          });
        }
      });
    },
    {
      validate() {
        cy.visit('/sign-in');
        cy.get('.moj-header__navigation-item > .moj-header__navigation-link').contains('Sign out').should('be.visible');
      },
    },
  );

  cy.visit('/sign-in');
}
