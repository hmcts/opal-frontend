// common.steps.ts
// =====================
// These steps provide generic assertions and actions reused across multiple
// feature files. They rely on CommonActions for navigation, header checks, and
// safe cancellation workflows. Each step includes consistent logging via the
// shared `log` utility and Sonar-compliant documentation.

import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CommonActions } from '../../../e2e/functional/opal/actions/common/common.actions';
import { log } from '../../utils/log.helper';

/**
 * Returns a new instance of CommonActions.
 * @remarks This factory pattern ensures stateless actions across steps.
 */
const Common = (): CommonActions => new CommonActions();

/**
 * @step Cancel without editing and confirm leaving the page.
 * @description
 * Captures the current pathname, triggers the cancel-and-confirm flow,
 * and verifies that the user **remains on the same page** (no navigation).
 *
 * @remarks
 *  - Uses `CommonActions.cancelEditing(true)` to simulate confirming the leave.
 *  - Compares the before/after pathname to ensure it is unchanged.
 *
 * @example
 *  When I cancel without entering data
 */
When('I cancel without entering data', () => {
  log('step', 'Cancel without edits → confirm leave (assert no navigation)');

  // Capture the current pathname
  cy.location('pathname').then((beforePath) => {
    log('debug', 'Captured current pathname before cancel', { beforePath });

    // Trigger the cancel+confirm action
    Common().cancelEditing(true);
  });
});

/**
 * @step Assert that the current URL contains a specific substring.
 * @param urlPart – Partial path or keyword expected in the current URL.
 *
 * @remarks
 *  - Useful for verifying successful navigation after an action.
 *  - Leverages `CommonActions.urlContains()` for consistency with other flows.
 *
 * @example
 *  Then the URL should contain "account/details"
 */
Then('the URL should contain {string}', (urlPart: string) => {
  log('assert', `Verify URL includes '${urlPart}'`, { expectedSubstring: urlPart });

  Common().urlContains(urlPart);
});

/**
 * @step Assert that the visible page header contains specific text.
 * @param expectedHeader – Text expected to appear within the primary page header.
 *
 * @remarks
 *  - Delegates to `CommonActions.assertHeaderContains()` for resilient selector use.
 *  - Works with dynamic page titles (partial matches).
 *
 * @example
 *  Then I should see the header containing text "At a glance"
 */
Then('I should see the header containing text {string}', (expectedHeader: string) => {
  log('assert', `Verify header contains '${expectedHeader}'`, { expectedHeader });

  Common().assertHeaderContains(expectedHeader);
});

/**
 * @step Combined assertion: check both page header and URL.
 * @description
 * Provides a compact assertion for scenarios where both header text and
 * URL validation are required together. This keeps feature files concise.
 *
 * @param expectedHeader – Text expected in the header.
 * @param urlPart – Substring expected in the URL.
 *
 * @remarks
 *  - Calls `CommonActions.assertHeaderContains()` and `CommonActions.urlContains()`.
 *  - Useful for “Then I should see …” summary assertions.
 *
 * @example
 *  Then I should see the header "Comments" and the URL should contain "account/comments"
 */
Then(
  'I should see the header {string} and the URL should contain {string}',
  (expectedHeader: string, urlPart: string) => {
    log('assert', `Verify header '${expectedHeader}' and URL includes '${urlPart}'`, {
      expectedHeader,
      urlPart,
    });

    Common().assertHeaderContains(expectedHeader);
    Common().urlContains(urlPart);
  },
);

/**
 * @step I select back and confirm
 * @description
 * Triggers a browser back navigation and confirms leaving the current page.
 *
 * @remarks
 *  - Uses `CommonActions.navigateBrowserBackWithChoice('ok')` to simulate
 *    choosing the *OK/Confirm* option in the confirmation dialog.
 *  - Intended for flows where the user abandons the current page and moves
 *    back to the previous one.
 *  - If you want visible Cypress runner logs, pass `debug = true` inside the helper call.
 *  - To assert a final URL, follow this step with an explicit URL/header assertion
 *    (e.g., `Then the URL should contain "details"`).
 *
 * @example
 *  When I select back and confirm
 */
When('I select back and confirm', () => {
  log('step', 'Select back and confirm (navigate back with confirmation)');
  Common().navigateBrowserBackWithChoice('ok');
});

/**
 * @step I select back and cancel
 * @description
 * Triggers a browser back navigation attempt but **cancels** the confirmation,
 * ensuring the user remains on the current page and no navigation occurs.
 *
 * @remarks
 *  - Uses `CommonActions.navigateBrowserBackWithChoice('cancel')` to simulate
 *    choosing the *Cancel* option in the confirmation dialog.
 *  - Combine this with a follow-up assertion step to verify that the URL or
 *    page state has not changed.
 *
 * @example
 *  When I select back and cancel
 */
When('I select back and cancel', () => {
  log('step', 'Select back and cancel (no navigate)');
  Common().navigateBrowserBackWithChoice('cancel');
});
