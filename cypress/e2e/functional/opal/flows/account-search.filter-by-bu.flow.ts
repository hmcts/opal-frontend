/**
 * @file account-search.filter-by-bu.flow.ts
 * @description High-level flow for navigating to and validating the
 * **Filter by Business Unit** page for both *Fines* and *Confiscation*.
 *
 * This flow coordinates multiple action classes and provides a stable
 * abstraction layer for Cucumber step definitions. No Cypress commands or
 * selectors are used directly inside step files — all behaviour is routed
 * through this flow.
 */

import { AccountSearchIndividualsActions } from '../actions/search/search.individuals.actions';
import { SearchFilterByBUCommonActions } from '../actions/search/search.filter-by-bu.common.actions';
import { SearchFilterByBUNavActions } from '../actions/search/search.filter-by-bu.nav.actions';
import { SearchFilterByBUFinesActions } from '../actions/search/search.filter-by-bu-fines.actions';
import { AccountSearchCommonActions } from '../actions/search/search.common.actions';
import { SearchFilterByBUConfiscationActions } from '../actions/search/search.filter-by-bu-confiscation.actions';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { DashboardActions } from '../actions/dashboard.actions';

const commonActions = new SearchFilterByBUCommonActions();
const navActions = new SearchFilterByBUNavActions();
const finesActions = new SearchFilterByBUFinesActions();
const confiscationActions = new SearchFilterByBUConfiscationActions();
const log = createScopedLogger('SearchFilterByBUFlow');

/** Flow wrapper around business unit filter navigation and assertions. */
export class SearchFilterByBUFlow {
  private readonly dashboard = new DashboardActions();
  private readonly searchIndividuals = new AccountSearchIndividualsActions();
  private readonly searchCommonActions = new AccountSearchCommonActions();

  /**
   * Navigates from the Dashboard to the Filter-by-BU screen.
   *
   * Steps:
   *   1. Dashboard → Account Search
   *   2. Assert Individuals form is active (default expected behaviour)
   *   3. Open the Business Unit filter via the “Change” link
   *
   * Delegates:
   *   - DashboardActions.goToAccountSearch()
   *   - AccountSearchIndividualsActions.assertDefaultIndividualsActive()
   *   - AccountSearchCommonActions.openBusinessUnitFilter()
   *
   * @example
   *   Given I navigate to the Filter by business unit page
   */
  navigateToFilterByBusinessUnit(): void {
    log('navigate', 'Go to Account Search from dashboard');
    this.dashboard.goToAccountSearch();

    log('assert', 'Verify Individuals form is active by default');
    this.searchIndividuals.assertDefaultIndividualsActive();

    log('assert', 'Open Business Unit Filter');
    this.searchCommonActions.openBusinessUnitFilter();

    navActions.verifyFinesTabIsActive();
  }

  /**
   * Asserts all UI defaults for the **Fines** tab on the Filter by business unit page:
   * - Header is “Filter by business unit”
   * - Fines/Confiscation tabs exist and Fines is active
   * - Save selection button and Cancel link are visible
   * - Fines master checkbox is labelled “Fines business units” and checked by default
   */
  verifyFinesPageDefaults(): void {
    // Page heading
    commonActions.verifyHeader();

    // Tabs present and Fines selected
    navActions.verifyTwoTabsExist();
    navActions.verifyFinesTabIsActive();

    // Common controls visible
    commonActions.verifySaveSelectionVisible();
    commonActions.verifyCancelLinkVisible();

    // Fines-specific master checkbox present and checked by default
    finesActions.verifyMasterCheckboxPresent();
    finesActions.verifyMasterCheckboxCheckedByDefault();
  }

  /**
   * Switches from the Fines tab to the Confiscation tab (no assertions).
   */
  switchToConfiscationTab(): void {
    navActions.goToConfiscationTab();
  }

  /**
   * Switches from Confiscation (or anywhere) → Fines tab.
   */
  switchToFinesTab(): void {
    navActions.goToFinesTab();
  }

  /**
   * Asserts all UI defaults for the **Confiscation** tab:
   * - Header present with two tabs (Fines, Confiscation)
   * - Confiscation tab active
   * - Save/Cancel controls visible
   * - Confiscation master checkbox labelled “Confiscation business units” and checked by default
   */
  verifyConfiscationPageDefaults(): void {
    // Page heading
    commonActions.verifyHeader();

    // Tabs present and Confiscation selected
    navActions.verifyTwoTabsExist();
    navActions.verifyConfiscationTabIsActive();

    // Common controls visible
    commonActions.verifySaveSelectionVisible();
    commonActions.verifyCancelLinkVisible();

    // Confiscation-specific master checkbox present + checked by default

    confiscationActions.verifyMasterCheckboxPresent();
    confiscationActions.verifyMasterCheckboxCheckedByDefault();
  }
  /**
   * Clears all business units on a given tab using the master checkbox
   * and verifies that no units remain selected.
   *
   * @param tab - "Fines" or "Confiscation"
   */
  clearAllBusinessUnitsOnTab(tab: 'Fines' | 'Confiscation'): void {
    log('action', `Clearing all business units on ${tab} tab`);

    if (tab === 'Fines') {
      this.switchToFinesTab();
      finesActions.unselectAllBusinessUnits();
      finesActions.verifyNoBusinessUnitsSelected();
      return;
    }

    this.switchToConfiscationTab();
    confiscationActions.unselectAllBusinessUnits();
    confiscationActions.verifyNoBusinessUnitsSelected();
  }

  /**
   * Verifies that no business units are selected on the given tab.
   *
   * @param tab - "Fines" or "Confiscation"
   */
  verifyNoBusinessUnitsSelectedOnTab(tab: 'Fines' | 'Confiscation'): void {
    log('assert', `Verifying no business units selected on ${tab} tab`);

    if (tab === 'Fines') {
      this.switchToFinesTab();
      finesActions.verifyNoBusinessUnitsSelected();
      return;
    }

    this.switchToConfiscationTab();
    confiscationActions.verifyNoBusinessUnitsSelected();
  }

  /**
   * Selects Fines business units by display name.
   *
   * @param names - e.g. ["Bedfordshire", "Bolton"]
   */
  selectFinesBusinessUnits(names: string[]): void {
    log('action', `Flow: selecting Fines units: ${names.join(', ') || '<none>'}`);
    this.switchToFinesTab();
    finesActions.selectBusinessUnitsByNames(names);
  }

  /**
   * Selects Confiscation business units by display name.
   *
   * @param names - e.g. ["Berwick"]
   */
  selectConfiscationBusinessUnits(names: string[]): void {
    log('action', `Flow: selecting Confiscation units: ${names.join(', ') || '<none>'}`);
    this.switchToConfiscationTab();
    confiscationActions.selectBusinessUnitsByNames(names);
  }

  /**
   * Clicks Save selection.
   */
  saveBusinessUnitSelection(): void {
    log('action', 'Flow: saving business unit selection');
    commonActions.saveSelection();
  }

  /**
   * Verifies we are back on the "Search for an account" page.
   * Uses existing AccountSearch common behaviour.
   */
  verifyReturnedToAccountSearch(): void {
    log('assert', 'Verifying we are on the "Search for an account" page');

    // Reuse existing assertion that Individuals tab is the default view
    this.searchIndividuals.assertDefaultIndividualsActive();

    // Optional: header check if you have it
    this.searchCommonActions.assertHeaderContains('Search for an account');
  }

  /**
   * Verifies the business unit filter summary row shows the expected text.
   *
   * Example DOM (from summary list):
   *   <dt>Filter by business unit</dt>
   *   <dd id="accountDetailsLanguagePreferencesValue">Bedfordshire Bolton Berwick</dd>
   *
   * @param expectedSummary - e.g. "Bedfordshire Bolton Berwick"
   */
  verifyBusinessUnitFilterSummary(expectedSummary: string): void {
    log('assert', `Verifying business unit filter summary shows: "${expectedSummary}"`);

    cy.get('#accountDetailsLanguagePreferencesValue')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        // Normalise:
        // - trim whitespace
        // - collapse multiple spaces
        // - replace non-breaking spaces
        // - remove trailing commas or weird spacing
        const normalised = text
          .replaceAll('\u00A0', ' ')
          .replaceAll(/\s+/g, ' ') // collapse whitespace
          .trim();

        log('debug', `Normalised summary text: "${normalised}"`);
        expect(normalised).to.equal(expectedSummary);
      });
  }

  /**
   * Switches the tab in the Filter-by-Business-Unit screen.
   *
   * @param tab - "Fines" or "Confiscation"
   */
  switchToTab(tab: 'Fines' | 'Confiscation'): void {
    log('assert', `Verifying no business units selected on ${tab} tab`);

    if (tab === 'Fines') {
      navActions.goToFinesTab();
      return;
    }

    navActions.goToConfiscationTab();
  }

  /**
   * Saves the current business unit selection and verifies:
   * - The user is returned to the "Search for an account" page
   * - The business unit filter summary text matches the expected value
   *
   * This encapsulates the post-selection behaviour into a single, reusable flow step.
   *
   * @param expectedSummary - The expected summary text,
   *   e.g. "Bedfordshire, Berwick, Bolton".
   */
  saveSelectionAndVerifySummary(expectedSummary: string): void {
    log('action', 'Saving business unit selection from Filter by business unit page');
    commonActions.saveSelection();

    log('assert', 'Verifying we are back on the "Search for an account" page');
    this.searchCommonActions.assertHeaderContains('Search for an account');

    log('assert', `Verifying business unit filter summary is "${expectedSummary}"`);

    cy.get('#accountDetailsLanguagePreferencesValue')
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const normalised = text
          .replaceAll('\u00A0', ' ')
          .replaceAll(/\s+/g, ' ') // collapse whitespace/newlines
          .trim();

        log('debug', `Normalised filter summary text: "${normalised}"`);

        expect(normalised).to.equal(expectedSummary);
      });
  }

  /**
   * Cancels the Filter-by-Business-Unit selection and verifies only that:
   * - The user returns to the "Search for an account" page.
   */
  cancelBusinessUnitSelection(): void {
    log('flow', 'Cancelling Filter-by-Business-Unit selection');

    // Ensure tab content is rendered before interacting with the cancel link.
    navActions.verifyFinesTabIsActive();
    commonActions.cancel();

    log('assert', 'Verifying we are back on the "Search for an account" page');
    this.searchCommonActions.assertHeaderContains('Search for an account');
  }

  /**
   * Switches to the Confiscation tab, unselects all business units via the
   * master checkbox, and verifies that no units remain selected.
   *
   * Behaviour:
   *  - navigate to Confiscation tab
   *  - clear all Confiscation business units
   *  - assert no business units selected
   */
  switchAndClearConfiscationBusinessUnits(): void {
    log('flow', 'Switching to Confiscation tab and clearing all business units');

    navActions.goToConfiscationTab();
    confiscationActions.unselectAllBusinessUnits();
    confiscationActions.verifyNoBusinessUnitsSelected();
  }

  /**
   * Verifies which business units are selected on the specified tab.
   *
   * Switches to the correct tab ("Fines" or "Confiscation") and then asserts
   * that the expected business units are selected. This is a flow-level method
   * that orchestrates navigation and delegates the verification to the correct
   * action class.
   *
   * @param tab   - The tab to check, must be "Fines" or "Confiscation".
   * @param names - The business unit display names expected to be selected.
   *
   * Delegates:
   *   - SearchFilterByBUFinesActions.verifyBusinessUnitsSelectedByNames()
   *   - SearchFilterByBUConfiscationActions.verifyBusinessUnitsSelectedByNames()
   *
   * @example
   *   verifyBusinessUnitsSelectedOnTab("Fines", ["Bedfordshire", "Bolton"]);
   */
  verifyBusinessUnitsSelectedOnTab(tab: 'Fines' | 'Confiscation', names: string[]): void {
    const cleanedNames = names.map((name) => name.trim()).filter((name) => name.length > 0);

    log(
      'assert',
      `Flow: verifying selected business units on ${tab} tab: ${
        cleanedNames.length > 0 ? cleanedNames.join(', ') : '<none>'
      }`,
    );

    if (tab === 'Fines') {
      this.switchToFinesTab();
      finesActions.verifyBusinessUnitsSelectedByNames(cleanedNames);
      return;
    }

    this.switchToConfiscationTab();
    confiscationActions.verifyBusinessUnitsSelectedByNames(cleanedNames);
  }
}
