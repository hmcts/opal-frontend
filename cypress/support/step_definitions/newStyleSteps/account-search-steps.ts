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
// Locators
import { AccountSearchCommonLocators as C } from '../../../shared/selectors/account-search/account.search.common.locators';

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

/**
 * @step Navigates from the Dashboard to the Account Search page and verifies the Individuals form is shown by default.
 * @precondition User is authenticated (e.g. `Given I am logged in with email "..."`).
 * @details Delegates to `AccountSearchFlow.navigateAndVerifySearchFromDashboard()`.
 * @example
 *  Given I am on the Account Search page - Individuals form displayed by default
 */
Given('I am on the Account Search page - Individuals form displayed by default', () => {
  log('navigate', 'Navigating to Account Search from dashboard and verifying Individuals form by default');
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
  searchCommonActions().submitSearch();
});

/**
 * @step Asserts that a validation message instructs the user to search using a single section.
 * @details Delegates to `AccountSearchFlow.assertCrossSectionValidationMessage()`.
 * @example
 *  Then the request is rejected with guidance to search using a single section
 */
Then('the request is rejected with guidance to search using a single section', () => {
  log('assert', 'Verifying validation message for multiple section input');
  searchFlow().assertCrossSectionValidationMessage();
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
    searchFlow().verifyPageForCompanies(expectedHeader, map);
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

/**
 * @step Verifies a validation message for a Minor Creditor Individual is visible.
 * @param expectedText The text expected to be shown (use quotes in feature files).
 * @details Delegates to `AccountSearchMinorCreditorsActions.assertValidationMessageContains()`.
 * @example And I see "Enter minor creditor first name, last name, address or postcode" validation message for an individual
 */
Then('I see {string} validation message for an individual', (expectedText: string) => {
  log('assert', `Verifying minor creditor validation message for individual: "${expectedText}"`);
  searchCommonActions().assertValidationMessageContains(expectedText);
});
