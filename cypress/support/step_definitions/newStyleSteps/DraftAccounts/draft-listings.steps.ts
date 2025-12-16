/**
 * @file draft-listings.steps.ts
 * @description
 * Step definitions for the Create and Manage Draft Accounts (inputter) and
 * Check and Validate Draft Accounts (checker) pages.
 */
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import {
  CreateManageDraftsActions,
  CreateManageTab,
} from '../../../../e2e/functional/opal/actions/draft-account/create-manage-drafts.actions';
import {
  CheckAndValidateDraftsActions,
  CheckAndValidateTab,
} from '../../../../e2e/functional/opal/actions/draft-account/check-and-validate-drafts.actions';
import { DraftAccountsTableLocators } from '../../../../shared/selectors/draft-accounts-table.locators';
import { CommonActions } from '../../../../e2e/functional/opal/actions/common/common.actions';
import { log } from '../../../utils/log.helper';

const createManage = () => new CreateManageDraftsActions();
const checkAndValidate = () => new CheckAndValidateDraftsActions();
const common = () => new CommonActions();

/**
 * @step Open the Create and Manage Draft Accounts page.
 * @description Navigates from the dashboard to the inputter draft listings and asserts the header.
 * @example When I open Create and Manage Draft Accounts
 */
When('I open Create and Manage Draft Accounts', () => {
  log('navigate', 'Opening Create and Manage Draft Accounts');
  createManage().openPage();
});

/**
 * @step Use the back link on Create and Manage Draft Accounts.
 * @description Clicks the GOV.UK back link rendered on the draft listings page.
 * @example When I go back from Create and Manage Draft Accounts
 */
When('I go back to Create and Manage Draft Accounts', () => {
  log('navigate', 'Clicking back link on Create and Manage Draft Accounts');
  createManage().goBack();
});

/**
 * @step Open the Check and Validate Draft Accounts page.
 * @description Navigates from the dashboard to the checker draft listings and asserts the header.
 * @example When I open Check and Validate Draft Accounts
 */
When('I open Check and Validate Draft Accounts', () => {
  log('navigate', 'Opening Check and Validate Draft Accounts');
  checkAndValidate().openPage();
});

/**
 * @step Switch tab on the Create and Manage Draft Accounts page.
 * @description Clicks the specified tab on the inputter view.
 * @param tab - Tab name (e.g., "In review", "Rejected").
 * @example When I view the "Rejected" tab on the Create and Manage Draft Accounts page
 */
When('I view the {string} tab on the Create and Manage Draft Accounts page', (tab: CreateManageTab) => {
  log('navigate', 'Switching Create and Manage tab', { tab });
  createManage().switchTab(tab);
});

/**
 * @step Switch tab on the Check and Validate page.
 * @description Clicks the specified tab on the checker view.
 * @param tab - Tab name (e.g., "To review", "Rejected").
 * @example When I view the "To review" tab on the Check and Validate page
 */
When('I view the {string} tab on the Check and Validate page', (tab: CheckAndValidateTab) => {
  log('navigate', 'Switching Check and Validate tab', { tab });
  checkAndValidate().switchTab(tab);
});

/**
 * @step Assert account type column text.
 * @description Verifies the draft listings table Account type column contains the expected text.
 * @param expected - Account type text to find.
 * @example Then I see "Fixed Penalty" in the account type column on the draft table
 */
Then('I see {string} in the account type column on the draft table', (expected: string) => {
  log('assert', 'Checking account type column contains expected text', { expected });
  cy.get(DraftAccountsTableLocators.cells.accountType, common().getTimeoutOptions()).should('contain.text', expected);
});
