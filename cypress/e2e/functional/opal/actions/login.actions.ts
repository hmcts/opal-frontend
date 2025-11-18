/**
 * @file login.actions.ts
 * @description
 * Cypress **Action module** for performing login in the HMCTS Opal application.
 * Handles both local/PR environment authentication and Microsoft SSO login,
 * using Cypress session caching for performance optimization.
 *
 * @remarks
 * - Supports multiple environments:
 *   - Localhost/PR builds → direct form-based login.
 *   - Microsoft SSO (AAD) → handled via `cy.origin()` cross-domain flow.
 * - Uses `cy.session()` to cache authenticated sessions per email address,
 *   significantly improving test performance in CI pipelines.
 * - All UI element selectors are defined in {@link login.locators.ts}.
 *
 * @example
 * ```ts
 * // Example usage in a Flow or step file:
 * performLogin('qa.user@example.com');
 * ```
 *
 * @see {@link login.locators.ts}
 */

import * as Locators from '../../../../shared/selectors/login.locators';

/**
 * Performs the full login flow for the given user.
 *
 * @param email - The email address of the user to log in.
 *
 * @details
 * - Detects environment type (local vs. Microsoft SSO) based on URL.
 * - Enters credentials via the appropriate authentication method.
 * - Verifies login success by asserting the “Sign out” link is visible.
 * - Caches the session for faster repeated test runs.
 */
export function performLogin(email: string): void {
  const password = Cypress.env('CYPRESS_TEST_PASSWORD') || '';

  Cypress.log({
    name: 'auth',
    displayName: 'Login',
    message: `Logging in as ${email}`,
    consoleProps: () => ({ email }),
  });

  cy.session(
    email,
    () => {
      cy.visit('/');

      cy.location('href').then((href) => {
        if (href.includes('pr-') || href.includes('localhost')) {
          // ──────────────────────────────
          // Local / PR environment login
          // ──────────────────────────────
          cy.wait(50);
          cy.get(Locators.usernameInput).type(email, { delay: 0 });
          cy.get(Locators.submitBtn).click();

          // Verify login success
          cy.get(Locators.signOutLink).should('exist');
        } else {
          // ──────────────────────────────
          // Microsoft SSO login
          // ──────────────────────────────
          cy.origin('https://login.microsoftonline.com', { args: { email, password } }, ({ email, password }) => {
            cy.wait(500);
            cy.get('input[type="email"]', { timeout: 12000 }).type(email, { delay: 0 });
            cy.get('input[type="submit"]').click();

            cy.get('input[type="password"]', { timeout: 12000 }).type(password, {
              log: false,
              delay: 0,
            });
            cy.get('input[type="submit"]').click();

            // “Stay signed in?” prompt
            cy.get('#idBtn_Back', { timeout: 12000 }).click();
          });
        }
      });
    },
    {
      validate() {
        // ──────────────────────────────
        // Session validation logic
        // ──────────────────────────────
        cy.visit('/sign-in');
        cy.get(Locators.signOutLink).should('be.visible');
      },
    },
  );

  // Ensure dashboard is accessible after session restoration
  cy.visit('/sign-in');
}
