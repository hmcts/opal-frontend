/**
 * @file auth.flow.ts
 * @description
 * Defines the **authentication flow** for logging into the HMCTS Opal application.
 * Encapsulates the login process (via SSO or local authentication)
 * and verifies successful navigation to the user’s authenticated home area.
 *
 * @remarks
 * - This flow provides a single entry point for test setup steps that require authentication.
 * - Delegates login logic to {@link performLogin} and post-login assertions to {@link PrimaryNavigationActions}.
 * - Used by step definitions in `auth.steps.ts` for reusable Gherkin scenarios.
 *
 * @example
 * ```ts
 * // Example usage inside a test or setup hook
 * loginAndVerifyDashboardLanding('qa.user@example.com');
 * ```
 *
 * @see {@link performLogin}
 * @see {@link PrimaryNavigationActions}
 */

import { assertSignOutLinkVisible, performLogin } from '../actions/login.actions';
import { PrimaryNavigationActions } from '../actions/primary-navigation.actions';

/**
 * Logs in using either SSO or local authentication
 * and asserts that the post-login dashboard landing has successfully loaded.
 *
 * @param email - The email address of the user to authenticate as.
 *
 * @details
 * - Calls {@link performLogin} to complete the login process.
 * - Instantiates {@link PrimaryNavigationActions} to confirm that the authenticated
 *   user lands on a valid post-login dashboard page for the current journey.
 */
export function loginAndVerifyDashboardLanding(email: string): void {
  performLogin(email);
  new PrimaryNavigationActions().assertDashboardLandingReady();
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
