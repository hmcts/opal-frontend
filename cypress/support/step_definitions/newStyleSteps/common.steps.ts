// common.steps.ts (ESM)
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CommonActions } from '../../../e2e/functional/opal/actions/common/common.actions';

// Factory pattern you’re using:
const Common = (): CommonActions => new CommonActions();

/**
 * Cancels edit mode (no field changes) and confirms leaving the page.
 * Reused across forms that show an "unsaved changes" prompt.
 */
When('I cancel without entering data', () => {
  // We want to end up back on the details view → confirmLeave = true
  Common().cancelEditing(true);
});

Then('the URL should contain {string}', (urlPart: string) => {
  Common().urlContains(urlPart);
});

Then('I should see the header containing text {string}', (expectedHeader: string) => {
  Common().assertHeaderContains(expectedHeader);
});

/**
 * Confirms the unsaved changes warning by clicking OK.
 *
 * @example
 * Then I confirm the unsaved changes warning by clicking OK
 */
Then('I confirm the unsaved changes warning by clicking OK', () => {
  Common().confirmUnsavedChangesDialog();
});

/**
 * Condensed assertion per your style: header + URL in one step.
 * Use this if you prefer the single Then from your scenario.
 */
Then(
  'I should see the header {string} and the URL should contain {string}',
  (expectedHeader: string, urlPart: string) => {
    Common().assertHeaderContains(expectedHeader);
    Common().urlContains(urlPart);
  },
);
