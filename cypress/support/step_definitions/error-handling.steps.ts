/**
 * @file error_handling.steps.ts
 * @description
 * Step definitions for verifying **error handling and access control** behaviour
 * across the Opal application.
 *
 * These steps validate that proper error pages, messages, and actions are shown
 * when users encounter restricted areas or unexpected failures.
 *
 * @remarks
 * - Built on top of helper assertions from `accessDenied.actions.ts`.
 * - Intended for negative or boundary test scenarios.
 * - Keeps the steps themselves declarative while encapsulating UI logic inside Actions.
 *
 * @example
 *   Then I should see an Access Denied page
 *   Then I should see an error message "Something went wrong"
 *   Then I should see a "Back to dashboard" action
 *
 * @see {@link assertAccessDeniedPage}
 * @see {@link assertBackToDashboardAction}
 */

import { Then } from '@badeball/cypress-cucumber-preprocessor';
import {
  assertAccessDeniedPage,
  assertBackToDashboardAction,
} from '../../e2e/functional/opal/actions/access-denied.actions';

/**
 * @step Asserts that the **Access Denied** page is displayed.
 *
 * @details
 * - Typically triggered when a user without proper permissions attempts to
 *   access a restricted route.
 * - Uses `assertAccessDeniedPage()` for a consistent validation of heading and layout.
 */
Then('I should see an Access Denied page', () => {
  assertAccessDeniedPage();
});

/**
 * @step Verifies that an action button or link with a specific label is visible.
 *
 * @param label - The expected label text for the action element (e.g., "Back to dashboard").
 *
 * @details
 * - Confirms that the appropriate recovery or redirection action is presented to the user.
 * - Uses `assertBackToDashboardAction()` to handle the underlying selector and assertion.
 */
Then('I should see a {string} action', (label: string) => {
  assertBackToDashboardAction(label);
});
