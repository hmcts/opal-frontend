/**
 * @file login.locators.ts
 * @description
 * Selector map for the **Login Page** and related global header elements.
 * Provides resilient locators used by login actions and post-login validation.
 *
 * @remarks
 * - Prefer `data-testid` attributes for stability.
 * - Fallback CSS selectors are included for legacy markup support.
 * - Also includes top-navigation elements required for login verification.
 *
 * @example
 * ```ts
 * cy.get(LoginLocators.usernameInput).type('qa.user@example.com');
 * cy.get(LoginLocators.submitBtn).click();
 * cy.get(LoginLocators.signOutLink).should('exist');
 * ```
 */

/** Username input field (supports both test ID and text input fallback). */
export const usernameInput = '[data-testid="login-username"], input[type="text"]';

/** Login/Submit button (supports both test ID and legacy form ID). */
export const submitBtn = '[data-testid="login-submit"], #submitForm';

/** Error message container shown after invalid login attempts. */
export const errorMessage = '[data-testid="login-error-message"]';

/** “Sign out” link in the GOV.UK/MOJ global header. */
export const signOutLink = 'nav[aria-label="Account navigation"] a.moj-header__navigation-link';

/** Organisation (HMCTS) link in the header. */
export const organisationLink = 'a.moj-header__link--organisation-name';

/** Service name (Opal) link in the header. */
export const serviceLink = 'a.moj-header__link--service-name';
