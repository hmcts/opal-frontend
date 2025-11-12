/**
 * @file auth.flow.ts
 * @description
 * Defines the **authentication flow** for logging into the HMCTS Opal application.
 * Encapsulates the login process (via SSO or local authentication)
 * and verifies successful navigation to the user’s dashboard.
 *
 * @remarks
 * - This flow provides a single entry point for test setup steps that require authentication.
 * - Delegates login logic to {@link performLogin} and post-login assertions to {@link DashboardActions}.
 * - Used by step definitions in `auth.steps.ts` for reusable Gherkin scenarios.
 *
 * @example
 * ```ts
 * // Example usage inside a test or setup hook
 * loginAndLandOnDashboard('qa.user@example.com');
 * ```
 *
 * @see {@link performLogin}
 * @see {@link DashboardActions}
 */

import { performLogin } from '../actions/login.actions';
import { DashboardActions } from '../actions/dashboard.actions';

/**
 * Logs in using either SSO or local authentication
 * and asserts that the dashboard has successfully loaded.
 *
 * @param email - The email address of the user to authenticate as.
 *
 * @details
 * - Calls {@link performLogin} to complete the login process.
 * - Instantiates {@link DashboardActions} to confirm that the dashboard
 *   is displayed for the authenticated user (email-based verification).
 */
export function loginAndLandOnDashboard(email: string): void {
  performLogin(email);
  new DashboardActions().assertDashboard(email);
}
