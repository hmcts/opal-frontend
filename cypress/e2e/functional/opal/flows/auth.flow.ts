/**
 * @file auth.flow.ts
 * @description
 * Defines the **authentication flow** for logging into the HMCTS Opal application.
 * Encapsulates the login process (via SSO or local authentication)
 * and verifies successful navigation to the user’s authenticated home area.
 *
 * @remarks
 * - This flow provides a single entry point for test setup steps that require authentication.
 * - Delegates login logic to {@link performLogin} and post-login assertions to {@link AccountSearchIndividualsActions}.
 * - Used by step definitions in `auth.steps.ts` for reusable Gherkin scenarios.
 *
 * @example
 * ```ts
 * // Example usage inside a test or setup hook
 * loginAndLandOnSearch('qa.user@example.com');
 * ```
 *
 * @see {@link performLogin}
 * @see {@link AccountSearchIndividualsActions}
 */

import { assertSignOutLinkVisible, performLogin } from '../actions/login.actions';
import { AccountSearchIndividualsActions } from '../actions/search/search.individuals.actions';

/**
 * Logs in using either SSO or local authentication
 * and asserts that the post-login home landing has successfully loaded.
 *
 * @param email - The email address of the user to authenticate as.
 *
 * @details
 * - Calls {@link performLogin} to complete the login process.
 * - Instantiates {@link AccountSearchIndividualsActions} to confirm that the authenticated
 *   user lands on a valid post-login home page for the current journey.
 */
export function loginAndLandOnSearch(email: string): void {
  performLogin(email);
  new AccountSearchIndividualsActions().assertOnSearchLandingPage();
}

/**
 * Logs in using either SSO or local authentication
 * and verifies the authenticated shell is available without asserting a specific landing page.
 *
 * @param email - The email address of the user to authenticate as.
 *
 * @details
 * - Calls {@link performLogin} to complete the login process.
 * - Verifies the signed-in shell is available via the Sign out control.
 * - Intended for feature-flag scenarios where the default landing page may be unavailable.
 */
export function loginAndAuthenticate(email: string): void {
  performLogin(email);
  assertSignOutLinkVisible();
}
