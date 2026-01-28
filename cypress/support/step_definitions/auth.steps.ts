/**
 * @file auth.steps.ts
 * @description
 * Step definitions for **authentication and login** flows.
 *
 * These steps are designed for use in Cucumber `.feature` tests
 * where login is a prerequisite for other actions.
 *
 * @remarks
 * - The steps use `loginAndLandOnDashboard()` from the `auth.flow` module.
 * - Logging uses the shared `log()` helper for consistent output.
 * - Supports parameterized logins for different users or roles.
 *
 * @example
 *   Given I am logged in with email "qa.user@example.com"
 *
 * @see {@link loginAndLandOnDashboard}
 */

import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { loginAndLandOnDashboard } from '../..//e2e/functional/opal/flows/auth.flow';
import { assertSignOutLinkVisible } from '../..//e2e/functional/opal/actions/login.actions';
import { log } from '../utils/log.helper';

/**
 * @step Logs in using the provided email address and confirms the user lands on the dashboard.
 *
 * @param email - The email address of the user to log in as.
 *
 * @details
 * - Delegates to the reusable `loginAndLandOnDashboard()` flow for actual login steps.
 * - Adds structured Cypress logging for traceability in test reports.
 * - Intended to be reusable across all authenticated scenarios.
 */
Given('I am logged in with email {string}', (email: string) => {
  log('step', 'Logging in via auth flow', { email });
  loginAndLandOnDashboard(email);
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
