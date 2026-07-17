/**
 * @file logout.steps.ts
 * @description
 * Consolidated step definitions for logout flows to ensure all feature
 * variants (singular/plural/create-and-manage) are matched.
 */
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { LogoutFlow } from '../../e2e/functional/opal/flows/logout-flow';

const logout = () => new LogoutFlow();

When(/I click on (create account|create-account|create-and-manage|search|account|accounts)/i, (target: string) => {
  // normalize to space-separated, lower-case key so hyphenated variants match
  const key = target
    .toLowerCase()
    .replace(/[-\s]+/g, ' ')
    .trim();

  if (key === 'create account' || key === 'create and manage') {
    logout().clickCreateAccount();
  } else if (key === 'search') {
    logout().clickSearch();
  } else if (key === 'account' || key === 'accounts') {
    logout().clickAccount();
  } else {
    throw new Error(`Unhandled click target: ${target}`);
  }
});

When('I sign out', () => {
  logout().signOut();
});

Then('I should be on the {string} page', (pageName: string) => {
  logout().verifyPage(pageName);
});
