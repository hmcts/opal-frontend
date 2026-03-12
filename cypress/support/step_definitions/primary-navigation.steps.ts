/**
 * @file primary-navigation.steps.ts
 * @description
 * Step definitions for Fines primary navigation behaviour.
 */

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { PrimaryNavigationFlow } from '../../e2e/functional/opal/flows/primary-navigation.flow';
import { log } from '../utils/log.helper';

const primaryNavigationFlow = () => new PrimaryNavigationFlow();

/**
 * Logs in and verifies the default Fines Search landing page.
 */
Given('I am logged in on the Fines Search landing page with email {string}', (email: string) => {
  log('step', 'Logging in and opening the Fines Search landing page', { email });
  primaryNavigationFlow().loginAndLandOnSearch(email);
});

/**
 * Asserts the default Fines primary navigation state after login.
 */
Then('I see the Fines primary navigation with Search selected by default', () => {
  log('assert', 'Checking default Fines primary navigation state');
  primaryNavigationFlow().assertDefaultSearchLanding();
});

/**
 * Selects a Fines area from the top-level primary navigation.
 */
When('I select the Fines primary navigation item {string}', (itemLabel: string) => {
  log('step', 'Selecting a Fines primary navigation item', { itemLabel });
  primaryNavigationFlow().selectArea(itemLabel);
});

/**
 * Asserts that the selected Fines area is displayed.
 */
Then('I am taken to the {string} Fines landing page', (itemLabel: string) => {
  log('assert', 'Checking selected Fines landing page', { itemLabel });
  primaryNavigationFlow().assertKnownAreaLanding(itemLabel);
});

/**
 * Signs out from the Fines primary navigation.
 */
When('I sign out from the Fines primary navigation', () => {
  log('step', 'Signing out from the Fines primary navigation');
  primaryNavigationFlow().signOut();
});

/**
 * Asserts that the user is returned to the OPAL sign-in page.
 */
Then('I am returned to the OPAL sign-in page', () => {
  log('assert', 'Checking the OPAL sign-in page is shown');
  primaryNavigationFlow().assertSignInPageVisible();
});
