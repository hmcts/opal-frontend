// Support/Step_definitions/newStyleSteps/account-search.steps.ts
/**
 * Step definitions for Account Search behaviour.
 * - Thin, intent-based steps delegating to AccountEnquiryFlow / AccountSearchFlow.
 * - Logging handled by shared `log()` utility for consistent Cypress output.
 */

import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { AccountEnquiryFlow } from '../../../e2e/functional/opal/flows/account-enquiry.flow';
import { AccountSearchFlow } from '../../../e2e/functional/opal/flows/account-search.flow';
// Actions
import { AccountSearchIndividualsActions } from '../../../e2e/functional/opal/actions/search/search.individuals.actions';
import { AccountSearchCompanyActions } from '../../../e2e/functional/opal/actions/search/search.companies.actions';
import { AccountSearchMinorCreditorsActions } from '../../../e2e/functional/opal/actions/search/search.minor-creditors.actions';
import { AccountSearchCommonActions } from '../../../e2e/functional/opal/actions/search/search.common.actions';
import { AccountSearchNavActions } from '../../../e2e/functional/opal/actions/search/search.nav.actions';
import { AccountSearchProblemActions } from '../../../e2e/functional/opal/actions/search/search.problem.actions';
import { ResultsActions } from '../../../e2e/functional/opal/actions/search.results.actions';
import { CommonActions } from '../../../e2e/functional/opal/actions/common/common.actions';
import { DashboardActions } from '../../../e2e/functional/opal/actions/dashboard.actions';

import { log } from '../../utils/log.helper';

type MinorCreditorType = 'Individual' | 'Company';

// Factory pattern for isolated, stateless flow instances
const flow = () => new AccountEnquiryFlow();
const searchFlow = () => new AccountSearchFlow();
const searchIndividualActions = () => new AccountSearchIndividualsActions();
const searchCompanyActions = () => new AccountSearchCompanyActions();
const searchMinorCreditorsActions = () => new AccountSearchMinorCreditorsActions();
const searchCommonActions = () => new AccountSearchCommonActions();
const searchNavActions = () => AccountSearchNavActions;
const searchProblemActions = () => new AccountSearchProblemActions();
const commonActions = () => new CommonActions();
const dashboardActions = () => new DashboardActions();
const resultsActions = () => new ResultsActions();

/**
 * @step Navigates from the Dashboard to the Account Search page and verifies the Individuals form is shown by default.
 * @precondition User is authenticated (e.g. `Given I am logged in with email "..."`).
 * @details Delegates to `AccountSearchFlow.navigateAndVerifySearchFromDashboard()`.
 * @example
 *  Given I am on the Account Search page - Individuals form displayed by default
 */
Given('I am on the Account Search page - Individuals form displayed by default', () => {
  log('navigate', 'Navigating to Account Search from dashboard and verifying Individuals form by default');
  // perform the real navigation (should be click-based)
  searchFlow().navigateAndVerifySearchFromDashboard();
});

/**
 * @step Submits the Individuals search with all fields empty.
 * @details Uses Individuals actions to click Search without entering data.
 * @example
 *  When I submit an empty individual account search
 */
When('I submit an empty individual account search', () => {
  log('action', 'Submitting empty individual account search');
  searchIndividualActions().submitEmptySearch();
});

/**
 * @step Submits the Companies search with all fields empty.
 * @details Uses Companies actions to click Search without entering data.
 * @example
 *  When I submit an empty company account search
 */
When('I submit an empty company account search', () => {
  log('action', 'Submitting empty company account search');
  searchCompanyActions().submitEmptySearch();
});

/**
 * @step Submits the Minor Creditors search with all fields empty.
 * @details Uses Minor Creditors actions to click Search without entering data.
 * @example
 *  When I submit an empty Minor Creditors account search
 */
When('I submit an empty Minor Creditors account search', () => {
  log('action', 'Submitting empty Minor Creditor account search');
  searchMinorCreditorsActions().submitEmptySearch();
});

/**
 * @step Verifies the Individuals form shows default/empty values.
 * @details Asserts each field is blank (and suitable defaults for options if any).
 * @example
 *  Then the Individuals form shows default empty fields and options
 */
Then('the Individuals form shows default empty fields and options', () => {
  log('assert', 'Verifying Individuals form shows default empty fields and options');
  searchFlow().assertIndividualsDefaults();
});

/**
 * @step Switches to the Companies search form (tab).
 * @details Delegates to `AccountSearchFlow.viewCompaniesForm()`.
 * @example
 *  When I view the Companies search form
 */
When('I view the Companies search form', () => {
  log('navigate', 'Switching to Companies form');
  searchFlow().viewCompaniesForm();
});

/**
 * @step Switches to the Individuals search form (tab).
 * @details Delegates to `AccountSearchFlow.viewIndividualsForm()`.
 * @example
 *  When I view the Individuals search form
 */
When('I view the Individuals search form', () => {
  log('navigate', 'Switching to Individuals form');
  searchFlow().viewIndividualsForm();
});

/**
 * @step Go to search and enter individual details without clicking submit.
 * @details Delegates to `AccountSearchFlow.enterIndividualsFormWithoutSubmit()`.
 * @example
 *  I view the Individuals search form and enter the following:
 *     | account number | 12345678 |
 */
When('I view the Individuals search form and enter the following:', function (table: DataTable) {
  log('navigate', 'Switching to Individuals form');
  searchFlow().enterIndividualsFormWithoutSubmit(table);
});

When('I navigate the Individuals search form and enter the following:', function (table: DataTable) {
  searchFlow().navigateAndEnterIndividualsFormWithoutSubmit(table);
});

/**
 * @step Switches to the Minor Creditors search form (tab).
 * @details Delegates to `AccountSearchFlow.viewSearchMinorCreditorsForm()`.
 * @example
 *  When I view the Minor Creditors search form
 */
When('I view the Minor Creditors search form', () => {
  log('navigate', 'Switching to the Minor Creditors search form');
  searchFlow().viewMinorCreditorsForm();
});

/**
 * @step Switches to the Major Creditors search form (tab).
 * @details Delegates to `AccountSearchFlow.viewSearchMajorCreditorsForm()`.
 * @example
 *  When I view the Major Creditors search form
 */
When('I view the Major Creditors search form', () => {
  log('navigate', 'Switching to the Major Creditors search form');
  searchFlow().viewMajorCreditorsForm();
});

/**
 * @step Verifies the Companies form shows default/empty values.
 * @details Delegates to `AccountSearchFlow.assertCompaniesDefaults()`.
 * @example
 *  Then the Companies form shows default empty fields and options
 */
Then('the Companies form shows default empty fields and options', () => {
  log('assert', 'Verifying Companies form defaults');
  searchFlow().assertCompaniesDefaults();
});

/**
 * @step Switches to the Minor creditors search form (tab).
 * @details Delegates to `AccountSearchFlow.viewMinorCreditorsForm()`.
 * @example
 *  When I view the Minor creditors search form
 */
When('I view the Minor creditors search form', () => {
  log('navigate', 'Switching to Minor creditors form');
  searchFlow().viewMinorCreditorsForm();
});

/**
 * @step Chooses the Minor Creditor type (Individual or Company).
 * @param type The target minor creditor type.
 * @details Delegates to `AccountSearchMinorCreditorsActions.chooseType()`.
 * @example
 *  When I choose minor creditor type "Company"
 */
When('I choose minor creditor type {string}', (type: MinorCreditorType) => {
  log('action', `Choosing minor creditor type: ${type}`);
  searchMinorCreditorsActions().chooseType(type);
});

/**
 * @step Switches the Minor Creditor type (e.g., from Individual to Company).
 * @param type The target minor creditor type.
 * @details Delegates to `AccountSearchMinorCreditorsActions.chooseType()`.
 * @example
 *  When I switch minor creditor type to "Company"
 */
When('I switch minor creditor type to {string}', (type: MinorCreditorType) => {
  log('action', `Switching minor creditor type to: ${type}`);
  searchMinorCreditorsActions().chooseType(type);
});

/**
 * @step Asserts that the user remains on the Minor creditors form (no navigation occurred).
 * @details Useful after validation or switching type.
 * @example
 *  Then the search remains on the Minor creditors form - no navigation
 */
Then('the search remains on the Minor creditors form - no navigation', () => {
  log('assert', 'Verifying Minor creditors form remains active');
  searchMinorCreditorsActions().assertOnSearchPage();
});

/**
 * @step Verifies a validation message for a Minor Creditor Individual or Company is visible.
 * @param expectedText The text expected to be shown (use quotes in feature files).
 * @param entity "individual" or "company"
 * @details Delegates to `AccountSearchMinorCreditorsActions.assertMinorValidationMessage()`.
 * @example
 *  Then I see "Enter minor creditor first name, last name, address or postcode" validation message for a minor creditor individual
 *  Then I see "Enter minor creditor company name or address" validation message for a minor creditor company
 */
Then(
  'I see {string} validation message for a minor creditor {word}',
  (expectedText: string, entity: 'individual' | 'company') => {
    log('assert', `Verifying minor creditor ${entity} validation message: "${expectedText}"`);
    searchCommonActions().assertValidationMessageContains(expectedText);
  },
);

/**
 * @step Prefills the Individuals form with a sample set of inputs (for stateful tests).
 * @details Delegates to `AccountSearchIndividualsActions.prepareIndividualsSample()`.
 * @example
 *  When I prepare an Individuals search - sample details provided
 */
When('I prepare an Individuals search - sample details provided', () => {
  log('prepare', 'Preparing Individuals search input');
  searchIndividualActions().prepareIndividualsSample();
});

/**
 * @step Switches away from Individuals and back again (to test reset/clear behaviour).
 * @details Delegates to `AccountSearchFlow.switchAwayAndBackToIndividuals()`.
 * @example
 *  When I switch away and back to the Individuals form
 */
When('I switch away and back to the Individuals form', () => {
  log('navigate', 'Switching away and back to Individuals form');
  searchFlow().switchAwayAndBackToIndividuals();
});

/**
 * @step Asserts the Individuals form has been cleared to defaults.
 * @details Delegates to `AccountSearchIndividualsActions.assertIndividualsCleared()`.
 * @example
 *  Then the Individuals form is cleared to defaults
 */
Then('the Individuals form is cleared to defaults', () => {
  log('assert', 'Verifying Individuals form cleared');
  searchIndividualActions().assertIndividualsCleared();
});

/**
 * @step Prefills the Companies form with a sample set of inputs.
 * @details Delegates to `AccountSearchFlow.prepareCompaniesSample()`.
 * @example
 *  When I prepare a Companies search - sample details provided
 */
When('I prepare a Companies search - sample details provided', () => {
  log('prepare', 'Preparing Companies search input');
  searchFlow().prepareCompaniesSample();
});

/**
 * @step Switches away from Companies and back again (to test reset/clear behaviour).
 * @details Delegates to `AccountSearchFlow.switchAwayAndBackToCompanies()`.
 * @example
 *  When I switch away and back to the Companies form
 */
When('I switch away and back to the Companies form', () => {
  log('navigate', 'Switching away and back to Companies form');
  searchFlow().switchAwayAndBackToCompanies();
});

/**
 * @step Asserts the Companies form has been cleared to defaults.
 * @details Delegates to `AccountSearchCompanyActions.assertCompaniesCleared()`.
 * @example
 *  Then the Companies form is cleared to defaults
 */
Then('the Companies form is cleared to defaults', () => {
  log('assert', 'Verifying Companies form cleared');
  searchCompanyActions().assertCompaniesCleared();
});

/**
 * @step Prefills the Minor creditors form for a given type with sample inputs.
 * @param type The minor creditor type to prepare ("Individual" | "Company").
 * @details Delegates to `AccountSearchFlow.prepareMinorCreditorsSample()`.
 * @example
 *  When I prepare a Minor creditors search for type "Individual" - sample details provided
 */
When('I prepare a Minor creditors search for type {string} - sample details provided', (type: MinorCreditorType) => {
  log('prepare', `Preparing Minor creditors search input for type: ${type}`);
  searchFlow().prepareMinorCreditorsSample(type);
});

/**
 * @step Switches away from Minor creditors and back again (to test reset/clear behaviour).
 * @details Delegates to `AccountSearchFlow.switchAwayAndBackToMinorCreditors()`.
 * @example
 *  When I switch away and back to the Minor creditors form
 */
When('I switch away and back to the Minor creditors form', () => {
  log('navigate', 'Switching away and back to Minor creditors form');
  searchFlow().switchAwayAndBackToMinorCreditors();
});

/**
 * @step Asserts the Minor creditors form has been cleared to defaults.
 * @details Delegates to `AccountSearchFlow.assertMinorCreditorsCleared()`.
 * @example
 *  Then the Minor creditors form is cleared to defaults
 */
Then('the Minor creditors form is cleared to defaults', () => {
  log('assert', 'Verifying Minor creditors form cleared');
  searchFlow().assertMinorCreditorsCleared();
});

/**
 * @step Submits the search request (whatever form is active).
 * @details Delegates to `AccountSearchCommonActions.submitSearch()`.
 * @example
 *  When I attempt the search
 */
When('I attempt the search', () => {
  log('action', 'Submitting search with multiple section data');
  searchCommonActions().clickSearchButton();
});

/**
 * @step Searches using structured inputs from a DataTable.
 * @param table DataTable containing search field values.
 * @details Delegates to `AccountSearchFlow.searchUsingInputs()`.
 * @example
 *  When I search using the following inputs:
 *    | account number | 12345678 |
 */
When('I search using the following inputs:', function (table: DataTable) {
  searchFlow().searchUsingInputs(table);
});

/**
 * @step Verifies that a problem page is displayed with the specified heading.
 * @param headingText The expected heading text on the problem page.
 * @details Delegates to `AccountSearchProblemActions.assertProblemPageDisplayed()`.
 * @example
 *  Then I see an page containing "There is a problem"
 */
Then('I see an page containing {string}', (headingText: string) => {
  log('assert', `Checking problem page heading equals "${headingText}"`);
  searchProblemActions().assertProblemPageDisplayed();
});

/**
 * @step Verifies that a specific validation message is displayed on the problem page.
 * @param expectedMessage The expected validation message text.
 * @details Delegates to `AccountSearchProblemActions.assertProblemDescription()`.
 * @example
 *  Then I see the validation message "Reference data and account information cannot be entered together when searching for an account. Search using either:"
 */
Then('I see the validation message {string}', (expectedMessage: string) => {
  log('assert', `Checking problem description contains: "${expectedMessage}"`);
  searchProblemActions().assertProblemDescription(expectedMessage);
});

/**
 * @step Verifies that specific options are listed on the problem page.
 * @param expectedCSV Comma-separated string of expected option texts.
 * @details Delegates to `AccountSearchProblemActions.assertProblemBulletedOptions()`.
 * @example
 *  Then I see the listed options "Reference data only, Account information only"
 */
Then('I see the listed options {string}', (expectedCSV: string) => {
  log('assert', `Checking problem bullet list contains: ${expectedCSV}`);
  searchProblemActions().assertProblemBulletedOptions(expectedCSV);
});

/**
 * @step Clicks the back link from the problem page.
 * @details Delegates to `AccountSearchProblemActions.clickBackLink()`.
 * @example
 *  When I go back from the problem page
 */
When('I go back from the problem page', () => {
  log('action', 'Go back from problem page');
  searchProblemActions().clickBackLink();
});

/**
 * Verifies the "Search for an account" page for Individuals.
 *
 * Expects a two-column DataTable with rows: | field | value |
 *
 * Example:
 *   Then I see the "Search for an account" page for individuals with the following details:
 *     | account number           | 12345678 |
 *     | reference or case number | REF-123  |
 *     | individual last name     | Smith    |
 *
 * Delegates to: searchFlow().verifyPageForIndividuals(expectedHeader, map)
 *
 * @param expectedHeader Exact or substring header to assert
 * @param table Two-column DataTable of field -> expected value
 */
Then(
  'I see the {string} page for individuals with the following details:',
  (expectedHeader: string, table: DataTable) => {
    const rows = table.rows();
    const map: Record<string, string> = {};
    for (const r of rows) {
      map[
        String(r[0] ?? '')
          .trim()
          .toLowerCase()
      ] = String(r[1] ?? '').trim();
    }

    log('assert', `Verify individuals page "${expectedHeader}" with map: ${JSON.stringify(map)}`);
    searchFlow().verifyPageForIndividuals(expectedHeader, map);
  },
);

/**
 * Verifies the "Search for an account" page for Companies.
 *
 * Expects a two-column DataTable with rows: | field | value |
 *
 * Example:
 *   Then I see the "Search for an account" page for companies with the following details:
 *     | account number           | 12345678 |
 *     | reference or case number | REF-123  |
 *     | company name             | CompanyOne |
 *
 * Delegates to: searchFlow().verifyPageForCompanies(expectedHeader, map)
 *
 * @param expectedHeader Page header text to assert
 * @param table Two-column DataTable of field -> expected value
 */
Then(
  'I see the {string} page for companies with the following details:',
  (expectedHeader: string, table: DataTable) => {
    const rows = table.rows();
    const map: Record<string, string> = {};
    for (const r of rows) {
      map[
        String(r[0] ?? '')
          .trim()
          .toLowerCase()
      ] = String(r[1] ?? '').trim();
    }

    log('assert', `Verify companies page "${expectedHeader}" with map: ${JSON.stringify(map)}`);
    searchFlow().verifyPageForCompanies(map);
  },
);

/**
 * Verifies the "Search for an account" page for Minor Creditors (Individual variant).
 *
 * Expects a two-column DataTable with rows: | field | value |
 * Must include 'minor creditor type' if you want type enforcement, but for this step the step name
 * explicitly chooses the individual variant so the flow will assert individual-related fields only.
 *
 * Example:
 *   Then I see the "Search for an account" page for minor creditors - individual with the following details:
 *     | minor creditor type      | Individual |
 *     | account number           | 12345678   |
 *     | individual last name     | Smith      |
 *
 * Delegates to: searchFlow().verifyPageForMinorIndividual(expectedHeader, map)
 *
 * @param expectedHeader Page header text to assert
 * @param table Two-column DataTable of field -> expected value (only individual keys will be asserted)
 */
Then(
  'I see the {string} page for minor creditors - individual with the following details:',
  (expectedHeader: string, table: DataTable) => {
    const rows = table.rows();
    const map: Record<string, string> = {};
    for (const r of rows) {
      map[
        String(r[0] ?? '')
          .trim()
          .toLowerCase()
      ] = String(r[1] ?? '').trim();
    }

    log('assert', `Verify minor (individual) page "${expectedHeader}" with map: ${JSON.stringify(map)}`);
    searchFlow().verifyPageForMinorIndividual(expectedHeader, map);
  },
);

/**
 * Verifies the "Search for an account" page for Minor Creditors (Company variant).
 *
 * Expects a two-column DataTable with rows: | field | value |
 * Use this step when you want to assert company-related minor creditor fields (company name, company postcode, etc.)
 *
 * Example:
 *   Then I see the "Search for an account" page for minor creditors - company with the following details:
 *     | minor creditor type      | Company    |
 *     | account number           | 12345678   |
 *     | reference or case number | REF-123    |
 *     | company name             | CompanyOne |
 *
 * Delegates to: searchFlow().verifyPageForMinorCompany(expectedHeader, map)
 *
 * @param expectedHeader Page header text to assert
 * @param table Two-column DataTable of field -> expected value (only company keys will be asserted)
 */
Then(
  'I see the {string} page for minor creditors - company with the following details:',
  (expectedHeader: string, table: DataTable) => {
    const rows = table.rows();
    const map: Record<string, string> = {};
    for (const r of rows) {
      map[
        String(r[0] ?? '')
          .trim()
          .toLowerCase()
      ] = String(r[1] ?? '').trim();
    }

    log('assert', `Verify minor (company) page "${expectedHeader}" with map: ${JSON.stringify(map)}`);
    searchFlow().verifyPageForMinorCompany(expectedHeader, map);
  },
);

/**
 * @step Assert we remain on the Search Individuals form (no navigation occurred).
 * @details Verifies URL still targets the Search Accounts search path and that the Individuals form root is visible.
 * @example Then the search remains on the Search Individuals form - no navigation
 */
Then('the search remains on the Search Individuals form - no navigation', () => {
  log('assert', 'Verifying search remains on the Search Individuals form (no navigation)');
  searchIndividualActions().assertRemainsOnSearchFormNoNavigation();
});

/*
 * @step Assert we remain on the Search Companies form (no navigation occurred).
 * @details Verifies URL still targets the Search Accounts search path and that the Companies form root is visible.
 * @example Then the search remains on the Search Companies form - no navigation
 */
Then('the search remains on the Search Companies form - no navigation', () => {
  log('assert', 'Verifying search remains on the Search Companies form (no navigation)');
  searchCompanyActions().assertRemainsOnSearchFormNoNavigation();
});

/**
 * @step Verifies a validation message is visible for a given search type (company/individual/minor/etc).
 * @param expectedText The exact text expected (quoted in the feature).
 * @param searchType The search type (e.g. Company, individual). Can be quoted or unquoted in the feature.
 * @example
 *   And I see "Reference or case number must only contain letters or numbers" validation message for a "Company"
 *   And I see "Enter minor creditor first name, last name, address or postcode" validation message for an individual
 */
Then(/^I see "([^"]+)" validation message for (?:a|an) "?([^"]+)"?$/, (expectedText: string, searchType: string) => {
  log('assert', `Verifying validation message for ${searchType}: "${expectedText}"`);
  searchCommonActions().assertValidationMessageContains(expectedText);
});

/**
 * @step Select back → confirm navigation → assert we returned to the Search page.
 * @description
 * Uses the shared CommonActions.navigateBrowserBackWithConfirmation() helper
 * to simulate a browser Back action and confirm the unsaved-changes dialog.
 *
 * After confirming, this step explicitly asserts that the user is returned to
 * the Dashboard
 *
 * @example
 *  When I select back and confirm I navigate to the Dashboard
 */
When('I select back with confirmation and verify I navigate to the Dashboard', () => {
  log('step', 'Back → expect navigation to Dashboard');

  // Accept/prepare confirm handler if the page might show an unsaved-changes dialog
  commonActions().navigateBrowserBackWithChoice('ok');

  // Assert we reached Dashboard
  log('assert', 'Verify Dashboard is displayed');
  dashboardActions().assertDashboard();
});

/**
 * @step I see the Search results page
 * @description
 * Asserts that the Search Results page is currently displayed.
 *
 * This step delegates to `resultsActions().assertPageDisplayed()`,
 * which verifies that the UI has navigated to the expected results
 * view and all required page markers are present.
 *
 * Typically used after triggering a successful search.
 *
 * @example
 *   Then I see the Search results page
 */

Then('I see the Search results page', () => {
  resultsActions().assertPageDisplayed();
});

/**
 * @step I go back from the results page
 * @description
 * Navigates back from the Search Results page to the Search page.
 *
 * This step uses `resultsActions().useBackLinkToReturnToSearch()`,
 * which activates the page’s Back/Return navigation control and
 * asserts that the user is returned to the Search screen.
 *
 * Useful for validating navigation flow and ensuring that
 * back-navigation works consistently.
 *
 * @example
 *   When I go back from the results page
 */

When('I go back from the results page', () => {
  resultsActions().useBackLinkToReturnToSearch();
});

/**
 * @step I intercept the "{accountType}" account search API
 * @description
 * Sets up Cypress network intercepts for the account search API,
 * based on the provided `accountType`.
 *
 * Delegates to `searchCommonActions().interceptAccountSearch(accountType)`,
 * which configures:
 *   • Live capture mode for "reference" and "account number" searches
 *   • Stubbed intercepts for "defendant" and "minor creditor" searches
 *
 * The resulting aliases (`@getDefendantAccounts`, `@getMinorCreditorAccounts`)
 * are used later by assertion steps to inspect outgoing request payloads.
 *
 * @param accountType The type of account search being performed.
 *                    Expected values: "reference", "account number",
 *                    "defendant", "minor creditor".
 *
 * @example
 *   When I intercept the "account number" account search API
 */

When('I intercept the {string} account search API', (accountType: string) => {
  searchCommonActions().interceptAccountSearch(accountType);
});

/**
 * @step The intercepted "{accountType}" account search API call will contain the following parameters:
 * @description
 * Validates the request body of a previously intercepted account search API call.
 *
 * Delegates to `searchCommonActions().interceptedSearchAccountAPIContains(accountType, table)`,
 * which:
 *   • Waits for the appropriate Cypress alias
 *   • Extracts the request payload
 *   • Uses the mapping definitions to resolve logical Gherkin keys
 *   • Compares expected values against the actual outbound API request
 *
 * A Gherkin data table must be provided, where each row defines:
 *   | logicalKey | expectedValue |
 *
 * This step ensures that the front-end constructs the correct payload for
 * the given account type.
 *
 * @param accountType The account type whose request should be validated.
 *                    Expected values: "defendant", "minor creditor".
 * @param table A Gherkin DataTable of expected request parameters.
 *
 * @example
 *   Then the intercepted "defendant" account search API call will contain the following parameters:
 *     | accountNumber       | 12345678A |
 *     | activeAccountsOnly  | false     |
 *     | businessUnitIds     | [1,2,3]   |
 */

Then(
  'the intercepted {string} account search API call will contain the following parameters:',
  (accountType: string, table: DataTable) => {
    searchCommonActions().interceptedSearchAccountAPIContains(accountType, table);
  },
);

/**
 * @step I see the Individuals search results:
 * @description
 * Composite step that:
 *  - Asserts the Search results page is displayed.
 *  - Asserts the "Individuals" tab is selected.
 *  - Asserts there is at least one row in the results table whose columns
 *    match all key/value pairs from the provided table.
 *
 * The DataTable is expected to be a simple key/value table where each row
 * represents a column header and its expected value in the matching row, e.g.:
 *
 *   Then I see the Individuals search results:
 *     | Ref | PCRAUTO008 |
 *
 * This is backed by AccountSearchFlow.assertIndividualsResultsForReference()
 * and ResultsActions.assertResultsRowMatchesColumns().
 *
 * @example
 *   Then I see the Individuals search results:
 *     | Ref | PCRAUTO008 |
 */
Then('I see the Individuals search results:', (table: DataTable) => {
  searchFlow().assertIndividualsResultsForReference(table);
});

/**
 * @step I see the Companies search results:
 * @description
 * Composite step that:
 *  - Selects the "Companies" tab.
 *  - Asserts the "Companies" tab is selected.
 *  - Asserts there is at least one row in the results table whose columns
 *    match all key/value pairs from the provided table.
 *
 * The DataTable is expected to be a simple key/value table where each row
 * represents a column header and its expected value in the matching row, e.g.:
 *
 *   When I see the Companies search results:
 *     | Ref | PCRAUTO008 |
 *
 * This is backed by AccountSearchFlow.assertCompaniesResultsForReference()
 * and ResultsActions.assertResultsRowMatchesColumns().
 *
 * @example
 *   When I see the Companies search results:
 *     | Ref | PCRAUTO008 |
 */
When('I see the Companies search results:', (table: DataTable) => {
  searchFlow().assertCompaniesResultsAlreadyOnCompanies(table);
});

/**
 * @step I see the Companies search results after switching tab:
 * @description
 * Verifies Companies search results after the user has switched to the
 * Companies tab from another tab (e.g. Individuals), using:
 *
 *   - AccountSearchFlow.assertCompaniesResultsWithTabSwitch()
 *
 * The DataTable must be a two-column table where each row is:
 *   | field | value |
 *
 * Example:
 *   Then I see the Companies search results after switching tab:
 *     | company name      | ACME LTD |
 *     | company reference | C123456  |
 */
Then('I see the Companies search results after switching tab:', (table: DataTable) => {
  searchFlow().assertCompaniesResultsWithTabSwitch(table);
});

/**
 * @step I see the Companies search results exclude:
 * @description
 * Verifies that the Companies search results do NOT contain the specified
 * values, using:
 *
 *   - AccountSearchFlow.assertCompaniesResultsDoNotContain()
 *
 * The DataTable must be a two-column table where each row is:
 *   | field | value to exclude |
 *
 * Example:
 *   Then I see the Companies search results exclude:
 *     | company name | BLOCKED LTD |
 *     | company name | LEGACY CO   |
 */
Then('I see the Companies search results exclude:', (table: DataTable) => {
  searchFlow().assertCompaniesResultsDoNotContain(table);
});

/**
 * @step I return to the Companies search page from the results with header "<header>" and the following values:
 * @description
 * Uses the Search results back link to return to the Companies account search
 * form, then verifies the Companies search header and field values using:
 *
 *   - AccountSearchFlow.returnToCompaniesSearchFromResults()
 *   - AccountSearchFlow.verifyPageForCompanies()
 *
 * The DataTable must be a two-column table where each row is:
 *   | field | value |
 *
 * Example:
 *   When I return to the Companies search page from the results
 *        with header "Search accounts – Companies" and the following values:
 *     | account number           | 25000002A  |
 *     | reference or case number | PCRAUTO008 |
 */
When('I return to the Companies search page from the results it is displayed with:', (table: DataTable) => {
  searchFlow().returnToCompaniesSearchFromResults(table);
});

/**
 * @step I see there are no matching results and I check my search
 * @description
 * Verifies that no Companies search results are returned and follows the
 * "Check your search" path to return to the search form, using:
 *
 *   - AccountSearchFlow.verifyNoResultsAndClickCheckYourSearch()
 *
 * Example:
 *   Then I see there are no matching results and I check my search
 */
Then('I see there are no matching results and I check my search', () => {
  searchFlow().verifyNoResultsAndClickCheckYourSearch();
});

/**
 * @step I return to the dashboard using the HMCTS link
 * @description
 * Navigates back to the Dashboard from the Account Search area by using
 * the HMCTS header link. This is the intent-based equivalent of a user
 * selecting the HMCTS logo / homepage link in the global header.
 *
 * This step delegates the full behaviour to:
 *
 *   - AccountSearchFlow.returnToDashboardViaHmctsLink()
 *
 * Behaviour:
 *   - Uses CommonActions.clickHmctsHomeLink() to perform the navigation.
 *   - Verifies arrival on the dashboard using DashboardActions.assertOnDashboard().
 *   - Does not alter any search state (navigation only).
 *
 * Example:
 *   And I return to the dashboard using the HMCTS link
 */
When('I return to the dashboard using the HMCTS link', () => {
  searchFlow().returnToDashboardViaHmctsLink();
});
