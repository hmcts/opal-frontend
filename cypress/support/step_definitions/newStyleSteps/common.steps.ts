// common.steps.ts
// =====================
// These steps provide generic assertions and actions reused across multiple
// feature files. They rely on CommonActions for navigation, header checks, and
// safe cancellation workflows. Each step includes Cypress logs for visibility
// and Sonar-compliant documentation.

import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CommonActions } from '../../../e2e/functional/opal/actions/account-details/common.actions';

/**
 * Returns a new instance of CommonActions.
 * @remarks This factory pattern ensures stateless actions across steps.
 */
const Common = (): CommonActions => new CommonActions();

/**
 * @step Cancel without editing and confirm leaving the page.
 * @description
 * Simulates cancelling a form or edit screen when no changes have been made.
 * Verifies that the browser navigates back to a details route.
 * The regex `/\\/details(\\/|$)/` allows for optional trailing slashes.
 *
 * @remarks
 *  - Uses `CommonActions.cancelEditing(true)` to confirm the navigation.
 *  - Adds a short 1.5s timeout for URL assertion since the redirect is instant.
 *
 * @example
 *  When I cancel without entering data
 */
When('I cancel without entering data', () => {
  Cypress.log({
    name: 'cancel',
    displayName: 'Common',
    message: 'Cancel without edits, confirm leave',
    consoleProps: () => ({ expectation: 'URL returns to details page' }),
  });

  Common().cancelEditing(true);

  cy.location('pathname', { timeout: 1500 }).should('match', /\/details(\/|$)/);
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
  Cypress.log({
    name: 'assert',
    displayName: 'URL Check',
    message: `Verify URL includes '${urlPart}'`,
    consoleProps: () => ({ expectedSubstring: urlPart }),
  });

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
  Cypress.log({
    name: 'assert',
    displayName: 'Header Check',
    message: `Verify header contains '${expectedHeader}'`,
    consoleProps: () => ({ expectedHeader }),
  });

  Common().assertHeaderContains(expectedHeader);
});

/**
 * @step Confirm the unsaved changes warning by selecting OK.
 * @description
 * Handles browser-style or modal confirmation dialogues when attempting to
 * leave a page with unsaved data. Ensures the “OK” response is simulated.
 *
 * @remarks
 *  - Triggers `CommonActions.confirmUnsavedChangesDialog()`.
 *  - Intended to follow any action that produces an unsaved changes prompt.
 *
 * @example
 *  Then I confirm the unsaved changes warning by clicking OK
 */
Then('I confirm the unsaved changes warning by clicking OK', () => {
  Cypress.log({
    name: 'dialog',
    displayName: 'Unsaved Changes',
    message: 'Confirming leave without saving',
  });

  Common().confirmUnsavedChangesDialog();
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
    Cypress.log({
      name: 'assert',
      displayName: 'Header + URL Combo',
      message: `Verify header '${expectedHeader}' and URL includes '${urlPart}'`,
      consoleProps: () => ({ expectedHeader, urlPart }),
    });

    Common().assertHeaderContains(expectedHeader);
    Common().urlContains(urlPart);
  },
);
