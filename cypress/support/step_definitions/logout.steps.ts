/**
 * @file logout.steps.ts
 * @description
 * Consolidated step definitions for logout flows to ensure all feature
 * variants (singular/plural/create-and-manage) are matched.
 */
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { LogoutFlow } from '../../e2e/functional/opal/flows/logout-flow';

const logout = () => new LogoutFlow();

/**
 * Perform sign out action using the LogoutFlow helper.
 */
When('I sign out', () => {
  logout().signOut();
});

/**
 * Verify current page. For "Sign in" assert SSO redirect; otherwise check page header.
 *
 * @param pageName - expected page name (e.g. "Sign in")
 */
Then('I should be on the {string} page', (pageName: string) => {
  const normalized = pageName
    .toLowerCase()
    .replace(/[-\s]+/g, ' ')
    .trim();
  if (normalized === 'sign in') {
    logout().verifySignInFlow();
  } else {
    logout().verifyPage(pageName);
  }
});

/**
 * Verify the user is being redirected to the sign-in flow (SSO auth entry point).
 */
Then('I should be redirected to the sign-in page', () => {
  logout().verifySignInFlow();
});
