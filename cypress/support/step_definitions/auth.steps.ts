/**
 * @file auth.steps.ts
 * @description
 * Step definitions for **authentication and login** flows.
 *
 * These steps are designed for use in Cucumber `.feature` tests
 * where login is a prerequisite for other actions.
 *
 * @remarks
 * - The steps use `loginAndVerifyDashboardLanding()` from the `auth.flow` module.
 * - Logging uses the shared `log()` helper for consistent output.
 * - Supports parameterized logins for different users or roles.
 *
 * @example
 *   Given I am logged in with email "qa.user@example.com"
 *
 * @see {@link loginAndVerifyDashboardLanding}
 */

import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { loginAndAuthenticate, loginAndVerifyDashboardLanding } from '../..//e2e/functional/opal/flows/auth.flow';
import { assertSignOutLinkVisible } from '../..//e2e/functional/opal/actions/login.actions';
import { log } from '../utils/log.helper';

/**
 * @step Logs in using the provided email address and confirms the dashboard landing is ready.
 *
 * @param email - The email address of the user to log in as.
 *
 * @details
 * - Delegates to the reusable `loginAndVerifyDashboardLanding()` flow for actual login steps.
 * - Adds structured Cypress logging for traceability in test reports.
 * - Intended to be reusable across all authenticated scenarios.
 */
Given('I am logged in with email {string}', (email: string) => {
  log('step', 'Logging in via auth flow', { email });
  loginAndVerifyDashboardLanding(email);
});

/**
 * @step Logs in using the provided email address without asserting a specific landing page.
 *
 * @param email - The email address of the user to authenticate as.
 *
 * @details
 * - Delegates to `loginAndAuthenticate()` so feature-flag scenarios can assert their own
 *   landing behaviour when the default Search page may be disabled.
 */
Given('I am authenticated with email {string}', (email: string) => {
  log('step', 'Authenticating without asserting a specific landing page', { email });
  loginAndAuthenticate(email);
});

/**
 * @step Verifies the "Sign out" link is visible in the global header.
 *
 * @details
 * - Delegates to {@link assertSignOutLinkVisible} for the actual assertion.
 */
Then('The sign out link should be visible', () => {
  log('step', 'Verifying sign out link is visible');
  assertSignOutLinkVisible();
});
