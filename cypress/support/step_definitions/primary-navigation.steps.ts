/**
 * @file primary-navigation.steps.ts
 * @description
 * Step definitions for Fines primary navigation behaviour.
 */

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { PrimaryNavigationFlow } from '../../e2e/functional/opal/flows/primary-navigation.flow';
import { log } from '../utils/log.helper';
import { AccountSearchFlow } from '../../e2e/functional/opal/flows/account-search.flow';
import { AccountEnquiryFlow } from '../../e2e/functional/opal/flows/account-enquiry.flow';
import { PrimaryNavigationActions } from '../../e2e/functional/opal/actions/primary-navigation.actions';
import { applyUniqPlaceholder } from '../utils/stringUtils';

const primaryNavigationFlow = () => new PrimaryNavigationFlow();
const accountSearch = () => new AccountSearchFlow();
const accountEnquiry = () => new AccountEnquiryFlow();
const primaryNavigation = () => new PrimaryNavigationActions();

/**
 * Logs in and verifies the default Fines Search landing page.
 * @param email - User email used during authentication.
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
 * Asserts that the Fines primary navigation is visible.
 */
Then('I see the Fines primary navigation', () => {
  log('assert', 'Checking the Fines primary navigation is visible');
  primaryNavigationFlow().assertVisible();
});

/**
 * Asserts that the Fines primary navigation is hidden.
 */
Then('I do not see the Fines primary navigation', () => {
  log('assert', 'Checking the Fines primary navigation is hidden');
  primaryNavigationFlow().assertHidden();
});

/**
 * Asserts that a specific Fines primary navigation item is hidden.
 * @param itemLabel - Visible label of the navigation item expected to be absent.
 */
Then('I should not see the Fines primary navigation item {string}', (itemLabel: string) => {
  log('assert', 'Checking the Fines primary navigation item is hidden', { itemLabel });
  primaryNavigation().assertItemHidden(itemLabel);
});

/**
 * Starts the Add account note journey from an account found in browse mode.
 * @param surname - Surname used to locate the published account.
 */
When('I start the Add account note journey for {string}', (surname: string) => {
  const surnameWithUniq = applyUniqPlaceholder(surname);

  log('step', 'Starting Add account note journey from browse mode', { surname: surnameWithUniq });

  accountSearch().navigateAndVerifySearchFromDashboard();
  primaryNavigation().assertVisible();

  accountEnquiry().searchBySurname(surnameWithUniq);
  primaryNavigation().assertVisible();

  accountEnquiry().openMostRecentFromResults();
  primaryNavigation().assertVisible();

  accountEnquiry().openAddAccountNoteAndVerifyHeader();
});

/**
 * Completes the Add account note journey and returns to browse mode.
 * @param note - Note text to save.
 */
When('I complete the Add account note journey with note {string}', (note: string) => {
  log('step', 'Completing Add account note journey and returning to browse mode', { note });
  accountEnquiry().enterAndSaveNote(note);
});

/**
 * Cancels the Add account note journey and returns to browse mode.
 */
When('I cancel the Add account note journey', () => {
  log('step', 'Cancelling Add account note journey and returning to browse mode');
  accountEnquiry().cancelAccountNoteWithoutEntering();
});

/**
 * Selects a Fines area from the top-level primary navigation.
 * @param itemLabel - Visible label of the primary navigation item to select.
 */
When('I select the Fines primary navigation item {string}', (itemLabel: string) => {
  log('step', 'Selecting a Fines primary navigation item', { itemLabel });
  primaryNavigationFlow().selectArea(itemLabel);
});

/**
 * Asserts that the selected Fines area is displayed.
 * @param itemLabel - Visible label of the Fines area expected to be active.
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
