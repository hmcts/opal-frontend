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
 * - Logging is performed using `Cypress.log()` for consistent test runner output.
 * - Supports parameterized logins for different users or roles.
 *
 * @example
 *   Given I am logged in with email "qa.user@example.com"
 *
 * @see {@link loginAndLandOnDashboard}
 */

import { Given } from '@badeball/cypress-cucumber-preprocessor';
import { loginAndLandOnDashboard } from '../../../e2e/functional/opal/flows/auth.flow';

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
  Cypress.log({
    name: 'auth',
    displayName: 'Login',
    message: `Logging in as ${email}`,
    consoleProps: () => ({ email }),
  });

  loginAndLandOnDashboard(email);
});
