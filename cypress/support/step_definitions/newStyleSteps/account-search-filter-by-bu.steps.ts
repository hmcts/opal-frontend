/**
 * @file account-search-filter-by-bu.steps.ts
 * @description
 * Cucumber step definitions for the Filter-by-Business-Unit feature set.
 *
 * These steps are intentionally thin and delegate all real behaviour to
 * `SearchFilterByBUFlow`, ensuring:
 *  - No UI verbs in step wording (intent-driven only)
 *  - Steps remain stable even if the UI changes
 *  - All Cypress interactions live in actions/flows only
 */

import { Given, When, Then, DataTable } from '@badeball/cypress-cucumber-preprocessor';
import { SearchFilterByBUFlow } from '../../../e2e/functional/opal/flows/account-search.filter-by-bu.flow';
import { SearchFilterByBUCommonActions } from '../../../e2e/functional/opal/actions/search/search.filter-by-bu.common.actions';
import { AccountSearchCommonActions } from '../../../e2e/functional/opal/actions/search/search.common.actions';
import { log } from '../../utils/log.helper';

const filterByBUFlow = new SearchFilterByBUFlow();
const commonFilter = new SearchFilterByBUCommonActions();
const searchCommonActions = new AccountSearchCommonActions();

/**
 * @step Navigates from the Dashboard → Account Search → “Change” link in
 *       Business Units → Filter-by-Business-Unit page.
 * @precondition User is authenticated (via background step).
 * @details Delegates to:
 *          - DashboardActions.goToAccountSearch()
 *          - AccountSearchIndividualsActions.assertDefaultIndividualsActive()
 *          - AccountSearchCommonActions.openBusinessUnitFilter()
 * @example
 *   Given I navigate to the Filter by business unit page
 *
 */
Given('I navigate to the Filter by business unit page', () => {
  log('step', 'Navigating to Filter by business unit page');
  filterByBUFlow.navigateToFilterByBusinessUnit();
});

/**
 * @step Opens the Business Unit filter from the Account Search page.
 *
 * @description
 * Used when already on the "Search for an account" page and the scenario
 * needs to open the Business Unit filter via the "change" link.
 *
 * Delegates to:
 *   - SearchCommonActions.openBusinessUnitFilter()
 */
When('I open the business unit filter from the search page', () => {
  log('step', 'Opening business unit filter from search page');
  searchCommonActions.openBusinessUnitFilter();
});

/**
 * @step Asserts all default UI elements for the **Fines** tab.
 * @details Delegates to `SearchFilterByBUFlow.verifyFinesPageDefaults()`:
 *          - Page header = “Filter by business unit”
 *          - Tabs present (Fines, Confiscation)
 *          - Fines tab active
 *          - Save Selection + Cancel links visible
 *          - Master checkbox label = “Fines business units”
 *          - Master checkbox checked by default
 * @example
 *   Then the Filter by business unit page for Fines is shown with defaults
 */
Then('the Filter by business unit page for Fines is shown with defaults', () => {
  log('step', 'Asserting Filter by business unit defaults for Fines tab');
  filterByBUFlow.verifyFinesPageDefaults();
});

/**
 * @step Intent-based switch to the Confiscation tab.
 * @details Delegates to `SearchFilterByBUFlow.switchToConfiscationTab()`
 *          (which calls `SearchFilterByBUNavActions.goToConfiscationTab()`).
 *
 * @example
 *   When the user switches to the Confiscation tab
 *
 */
When('the user switches to the Confiscation tab', () => {
  log('step', 'Switching to Confiscation tab');
  filterByBUFlow.switchToConfiscationTab();
});

/**
 * @step Asserts all default UI elements for the **Confiscation** tab.
 * @details Delegates to `SearchFilterByBUFlow.verifyConfiscationPageDefaults()`:
 *          - Page header correct
 *          - Tabs present
 *          - Confiscation tab active
 *          - Save Selection + Cancel links visible
 *          - Master checkbox label = “Confiscation business units”
 *          - Master checkbox checked by default
 * @example
 *   Then the Confiscation Filter by business unit page is shown with defaults
 */
Then('the Confiscation Filter by business unit page is shown with defaults', () => {
  log('step', 'Asserting Filter by business unit defaults for Confiscation tab');
  filterByBUFlow.verifyConfiscationPageDefaults();
});

/**
 * @step Selects one or more business units across one or more tabs.
 *
 * @description
 * This is an intent-based, reusable step that supports selecting business units
 * on a single tab (e.g. only “Fines”) **or** multiple tabs (Fines + Confiscation)
 * using the same Gherkin data table structure.
 *
 * The step delegates all real UI work to `SearchFilterByBUFlow`, which:
 *   - switches to the required tab (“Fines” or “Confiscation”)
 *   - selects the corresponding business units
 *   - handles lazy-loading of business-unit name → ID maps
 *
 * @table columns:
 *   | tab           | businessUnit        |
 *   | Fines         | Bedfordshire        |
 *   | Fines         | Bolton              |
 *   | Confiscation  | Berwick             |
 *
 * @example (multi-tab)
 *   When I select the following business units:
 *     | tab           | businessUnit |
 *     | Fines         | Bedfordshire |
 *     | Fines         | Bolton       |
 *     | Confiscation  | Berwick      |
 *
 * @example (single-tab)
 *   When I select the following business units:
 *     | tab   | businessUnit |
 *     | Fines | Bolton       |
 *
 * @note
 * - The step has **no UI verbs**.
 * - It is **tab-agnostic**, scalable, and reusable.
 * - Data table values are cleaned and validated.
 */
When('I select the following business units:', (table: DataTable) => {
  log('step', 'Selecting business units from table');
  const rows = table.hashes(); // Array<Record<string, string>>

  const fines: string[] = [];
  const confiscation: string[] = [];

  for (const row of rows) {
    const tab = row['tab']?.trim();
    const name = row['businessUnit']?.trim();

    if (!tab || !name) {
      throw new Error(`Invalid table row: ${JSON.stringify(row)}`);
    }

    switch (tab) {
      case 'Fines':
        fines.push(name);
        break;

      case 'Confiscation':
        confiscation.push(name);
        break;

      default:
        throw new Error(`Unsupported tab value "${tab}". Expected "Fines" or "Confiscation".`);
    }
  }

  if (fines.length > 0) {
    filterByBUFlow.selectFinesBusinessUnits(fines);
  }

  if (confiscation.length > 0) {
    filterByBUFlow.selectConfiscationBusinessUnits(confiscation);
  }
});

/**
 * @step Clears all selected business units on the specified tab.
 *
 * @description
 * Uses the Filter-by-Business-Unit flow to unselect every business unit on
 * the given tab (Fines or Confiscation) via the tab-specific "unselect all"
 * logic.
 *
 * Delegates to:
 *   - `SearchFilterByBUFlow.clearAllBusinessUnitsOnTab(tab)`
 *
 * @example
 *   And I clear all selected business units on the "Fines" tab
 *   And I clear all selected business units on the "Confiscation" tab
 */
When('I clear all selected business units on the {string} tab', (tab: string) => {
  log('step', `Clearing selected business units on tab ${tab}`);
  filterByBUFlow.clearAllBusinessUnitsOnTab(tab as 'Fines' | 'Confiscation');
});

/**
 * @step Switches the currently active Filter-by-Business-Unit tab.
 *
 * @description
 * Switches between the Fines and Confiscation tabs on the Filter-by-BU page
 * using the nav actions. Does not assert the result; that should be covered
 * by a separate verification step.
 *
 * Delegates to:
 *   - `SearchFilterByBUFlow.switchToTab(tab)`
 *
 * @example
 *   And I switch to the "Confiscation" tab
 *   When I switch to the "Fines" tab
 */
When('I switch to the {string} tab', (tab: string) => {
  log('step', `Switching to ${tab} tab`);
  filterByBUFlow.switchToTab(tab as 'Fines' | 'Confiscation');
});

/**
 * @step Verifies the business unit filter summary text shown on the
 *       “Search for an account” page.
 *
 * @description
 * This step asserts that the GOV.UK Summary List row titled
 * **“Filter by business unit”** contains the exact expected text.
 *
 * It delegates all behaviour to:
 *   - `SearchFilterByBUFlow.verifyBusinessUnitFilterSummary(expectedSummary)`
 *
 * That flow method:
 *   - Locates the summary list value cell
 *   - Normalises whitespace (including line breaks and &nbsp;)
 *   - Compares the resulting text against the expected string
 *
 * The step is intentionally:
 *   - Thin
 *   - Intent-based (no UI verbs)
 *   - Reusable in any scenario verifying the applied business unit filter
 *
 * @example
 *   Then the business unit filter summary is "Bedfordshire, Bolton, Berwick"
 *
 * @param expected
 *   The expected summary value shown on the Account Search page.
 */

Then('the business unit filter summary is {string}', (expected: string) => {
  log('step', 'Verifying business unit filter summary', { expected });
  filterByBUFlow.verifyBusinessUnitFilterSummary(expected);
});

/**
 * @step Saves the current business unit selection and verifies:
 *  - the user is back on the "Search for an account" page, and
 *  - the business unit filter summary text matches the expected value.
 *
 * @example
 *  And I save the selected business units and the filter summary is "Bedfordshire, Berwick, Bolton"
 */
Then('I save the selected business units and the filter summary is {string}', (expectedSummary: string) => {
  log('step', 'Saving selected business units and verifying summary', { expectedSummary });
  filterByBUFlow.saveSelectionAndVerifySummary(expectedSummary);
});

/**
 * @step Cancels the business unit selection and returns to Account Search.
 *
 * @description
 * Performs only the cancel action and verifies navigation back
 * to the Search for an account page.
 *
 * Summary text checks must be done via:
 *   Then the business unit filter summary is "<text>"
 *
 * @example
 *   When I cancel the business unit selection
 */
When('I cancel the business unit selection', () => {
  log('step', 'Cancelling business unit selection');
  filterByBUFlow.cancelBusinessUnitSelection();
});

/**
 * @step Verifies the total displayed on the "Save selection" button.
 *
 * @description
 * Asserts that the primary "Save selection" button reflects the expected
 * total count, e.g. "Save selection (2)".
 *
 * Delegates to:
 *   - `SearchFilterByBUFlow.verifySaveSelectionTotal(expectedTotal)`
 *
 * @example
 *   Then the "Save selection" button displays a total of 0
 *   Then the "Save selection" button displays a total of 2
 */
Then('the "Save selection" button displays a total of {int}', (expectedTotal: number) => {
  log('step', 'Verifying Save selection button total', { expectedTotal });
  commonFilter.verifySaveSelectionTotal(expectedTotal);
});

/**
 * @step Verifies which business units are selected on a given tab.
 *
 * @description
 * Confirms that the specified business units are selected on the named tab.
 * The tab name must be "Fines" or "Confiscation".
 *
 * Delegates to:
 *   - SearchFilterByBUFlow.verifyBusinessUnitsSelectedOnTab(tab, names)
 *
 * @table
 *   A single-column table of business unit display names:
 *     | Bedfordshire |
 *     | Bolton       |
 *
 * @example
 *   Then the business units selected on "Fines" are:
 *     | Bedfordshire |
 *     | Bolton       |
 */
Then('the business units selected on {string} are:', (tab: string, table: DataTable) => {
  log('step', 'Verifying selected business units on tab', { tab });
  const rows = table.raw();
  const names = rows.map((r) => r[0]?.trim()).filter(Boolean);

  filterByBUFlow.verifyBusinessUnitsSelectedOnTab(tab as 'Fines' | 'Confiscation', names);
});
