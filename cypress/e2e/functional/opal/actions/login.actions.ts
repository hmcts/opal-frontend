/**
 * @file login.actions.ts
 * @description
 * Cypress **Action module** for performing login in the HMCTS Opal application.
 * Handles both local/PR environment authentication and Microsoft SSO login,
 * using Cypress session caching for performance optimization.
 */

import { LoginLocators as L } from '../../../../shared/selectors/login.locators';
import { createScopedLogger } from '../../../../support/utils/log.helper';

const log = createScopedLogger('LoginActions');

/**
 * Performs the full login flow for the given user.
 *
 * @param email - The email address of the user to log in.
 */
export function performLogin(email: string): void {
  const password = Cypress.env('CYPRESS_TEST_PASSWORD') || '';

  log('action', 'Logging in', { email });

  cy.session(
    email,
    () => {
      cy.visit('/');

      cy.location('href').then((href) => {
        const isLocalOrPR = href.includes('pr-') || href.includes('localhost');

        if (isLocalOrPR) {
          // Local / PR environment login (form-based)
          log('navigate', 'Detected Local/PR environment → using form-based login', { href });

          cy.wait(50);
          cy.get(L.usernameInput).type(email, { delay: 0 });
          cy.get(L.submitBtn).click();

          log('assert', 'Verifying login success (Local/PR)');
          cy.get(L.signOutLink).should('exist');
          log('done', 'Login successful (Local/PR)', { email });
        } else {
          // Microsoft SSO login
          log('navigate', 'Detected non-local environment → using Microsoft SSO', { href });

          cy.origin('https://login.microsoftonline.com', { args: { email, password } }, ({ email, password }) => {
            cy.wait(500);

            // Email step
            cy.get('input[type="email"]', { timeout: 12_000 }).type(email, { delay: 0 });
            cy.get('input[type="submit"]').click();

            // Password step (never log password)
            cy.get('input[type="password"]', { timeout: 12_000 }).type(password, { log: false, delay: 0 });
            cy.get('input[type="submit"]').click();

            // “Stay signed in?” prompt
            cy.get('#idBtn_Back', { timeout: 12_000 }).click();
          });

          log('assert', 'Verifying login success (SSO)');
          cy.get(L.signOutLink).should('exist');
          log('done', 'Login successful (SSO)', { email });
        }
      });
    },
    {
      validate() {
        // Session validation logic
        log('assert', 'Validating restored session');
        cy.visit('/sign-in');
        cy.get(L.signOutLink).should('be.visible');
        log('done', 'Session validation succeeded', { email });
      },
    },
  );

  // Ensure app is accessible after session restoration
  log('navigate', 'Navigating to /sign-in after session setup');
  cy.visit('/sign-in');
}

/**
 * Asserts the "Sign out" link is visible in the global header.
 */
export function assertSignOutLinkVisible(): void {
  log('assert', 'Verifying sign out link is visible');
  cy.get(L.signOutLink, { timeout: 10_000 }).should('be.visible');
  log('done', 'Sign out link is visible');
}
