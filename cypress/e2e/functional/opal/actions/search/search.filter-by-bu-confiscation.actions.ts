/**
 * @file search.filter-by-bu-confiscation.actions.ts
 * @description
 * Confiscation-specific actions for the Filter-by-Business-Unit page.
 *
 * Responsibilities:
 * - Interact with and assert against the Confiscation master checkbox
 * - Interact with individual Confiscation business unit checkboxes (via a map)
 * - Verify which business units are selected
 * - Verify the “x of y selected” summary matches the expected count
 */

import { FinesFilterBusinessUnitConfiscationLocators } from '../../../../../shared/selectors/account-search/account.search.filter-by-bu-confiscation.locators';
import { SearchFilterByBUCommonLocators } from '../../../../../shared/selectors/account-search/account.search.filter-by-bu.common.locators';

import { createScopedLogger } from '../../../../../support/utils/log.helper';

export type BusinessUnitMap = Map<string, string>;

const log = createScopedLogger('SearchFilterByBUConfiscationActions');

export class SearchFilterByBUConfiscationActions {
  private readonly businessUnitNameToIdMap: Map<string, string> = new Map();

  /**
   * Builds a map of business-unit-name → id by scraping the DOM.
   * Runs lazily only once.
   */
  private ensureBusinessUnitMapLoaded(): void {
    if (this.businessUnitNameToIdMap.size > 0) return;

    cy.get(FinesFilterBusinessUnitConfiscationLocators.businessUnitLabels).each(($label) => {
      const name = $label.text().trim();
      const id = $label.attr('for');
      if (id) {
        this.businessUnitNameToIdMap.set(name, id);
      }
    });
  }
  // ──────────────────────────────
  // Master checkbox – "Confiscation business units"
  // ──────────────────────────────

  /**
   * Verifies that the master checkbox and label for
   * **"Confiscation business units"** are present.
   */
  verifyMasterCheckboxPresent(): void {
    log('info', 'Verifying presence of Confiscation master checkbox and label');

    cy.get(FinesFilterBusinessUnitConfiscationLocators.selectAllBusinessUnitsCheckbox).should('exist');
    cy.get(FinesFilterBusinessUnitConfiscationLocators.selectAllBusinessUnitsLabel)
      .should('exist')
      .and('contain.text', 'Confiscation business units');
  }

  /**
   * Verifies that the master checkbox is **checked by default**.
   */
  verifyMasterCheckboxCheckedByDefault(): void {
    log('info', 'Verifying master Confiscation business units checkbox is checked by default');

    cy.get(FinesFilterBusinessUnitConfiscationLocators.selectAllBusinessUnitsCheckbox).should('be.checked');
  }

  /**
   * Verifies the current checked state of the master checkbox.
   *
   * @param expectedChecked - `true` if the checkbox should be checked, `false` if not
   */
  verifyMasterCheckboxState(expectedChecked: boolean): void {
    log('info', `Verifying Confiscation master checkbox state is: ${expectedChecked}`);

    cy.get(FinesFilterBusinessUnitConfiscationLocators.selectAllBusinessUnitsCheckbox).should(
      expectedChecked ? 'be.checked' : 'not.be.checked',
    );
  }

  /**
   * Ensures the master checkbox is in the requested state (checked/unchecked).
   * If it is already in the requested state, no click is performed.
   *
   * @param shouldBeChecked - `true` to ensure it is checked, `false` to ensure it is unchecked
   */
  setMasterCheckboxState(shouldBeChecked: boolean): void {
    log('info', `Setting Confiscation master checkbox state to: ${shouldBeChecked}`);

    cy.get(FinesFilterBusinessUnitConfiscationLocators.selectAllBusinessUnitsCheckbox).then(($checkbox) => {
      const isChecked = $checkbox.is(':checked');

      // Positive condition to avoid negated-condition lint rule
      if (isChecked === shouldBeChecked) {
        log('info', 'Confiscation master checkbox already in desired state');
        return;
      }

      log('info', 'Toggling Confiscation master checkbox');
      cy.wrap($checkbox).click();
    });
  }

  // ──────────────────────────────
  // Individual business units – via map
  // ──────────────────────────────

  /**
   * Clicks (toggles) a **single business unit checkbox** based on a map entry.
   *
   * @param businessUnits - Map of logical name → business unit id (string)
   * @param key - The logical key in the map whose business unit should be toggled
   */
  toggleBusinessUnitFromMap(businessUnits: BusinessUnitMap, key: string): void {
    const id = businessUnits.get(key);

    if (!id) {
      throw new Error(`Business unit key "${key}" not found in map`);
    }

    log('info', `Toggling Confiscation business unit checkbox for key "${key}" (id: ${id})`);

    const selector = `${FinesFilterBusinessUnitConfiscationLocators.businessUnitRowIdPrefix}${id} input.govuk-checkboxes__input`;
    cy.get(selector).click();
  }

  /**
   * Verifies that **all business units** in the provided map are checked.
   *
   * @param businessUnits - Map of logical name → business unit id (string)
   */
  verifyBusinessUnitsChecked(businessUnits: BusinessUnitMap): void {
    log('info', `Verifying all Confiscation business units in map are checked (count: ${businessUnits.size})`);

    for (const [key, id] of businessUnits.entries()) {
      log('info', `Verifying Confiscation business unit is checked for key "${key}" (id: ${id})`);

      const selector = `${FinesFilterBusinessUnitConfiscationLocators.businessUnitRowIdPrefix}${id} input.govuk-checkboxes__input`;
      cy.get(selector).should('be.checked');
    }
  }

  /**
   * Verifies a single business unit (from the map) is checked.
   *
   * @param businessUnits - Map of logical name → business unit id (string)
   * @param key - Logical key in the map for which the checkbox must be checked
   */
  verifyBusinessUnitCheckedFromMap(businessUnits: BusinessUnitMap, key: string): void {
    const id = businessUnits.get(key);

    if (!id) {
      throw new Error(`Business unit key "${key}" not found in map`);
    }

    log('info', `Verifying Confiscation business unit is checked for key "${key}" (id: ${id})`);

    const selector = `${FinesFilterBusinessUnitConfiscationLocators.businessUnitRowIdPrefix}${id} input.govuk-checkboxes__input`;
    cy.get(selector).should('be.checked');
  }

  // ──────────────────────────────
  // Selection summary – “x of y selected”
  // ──────────────────────────────

  /**
   * Verifies that the **summary text** (e.g. `"6 of 6 selected"`)
   * contains `"x of "` where `x` equals the number of rows in the map.
   *
   * @param businessUnits - Map of logical name → business unit id (string)
   */
  verifySelectionSummaryCountMatchesMap(businessUnits: BusinessUnitMap): void {
    const expectedCount = businessUnits.size;

    log('info', `Verifying Confiscation selection summary text contains "${expectedCount} of "`);

    cy.get(FinesFilterBusinessUnitConfiscationLocators.selectionSummaryText)
      .invoke('text')
      .then((text) => {
        const trimmed = text.trim();
        log('info', `Current Confiscation summary text is: "${trimmed}"`);
      });

    cy.get(FinesFilterBusinessUnitConfiscationLocators.selectionSummaryText).should(
      'contain.text',
      `${expectedCount} of `,
    );
  }

  /**
   * Unchecks the master "Confiscation business units" checkbox (if currently checked).
   */
  unselectAllBusinessUnits(): void {
    log('action', 'Unselecting all Confiscation business units via master checkbox');
    this.setMasterCheckboxState(false);
  }

  /**
   * Asserts that no Confiscation business units are selected:
   * - Master checkbox is not checked
   * - No individual business unit checkboxes are checked
   * - Count label starts with "0 of"
   */
  verifyNoBusinessUnitsSelected(): void {
    log('assert', 'Verifying no Confiscation business units are selected');

    // Master checkbox not checked
    this.verifyMasterCheckboxState(false);

    // No individual checkboxes checked
    cy.get(FinesFilterBusinessUnitConfiscationLocators.businessUnitCheckboxes)
      .should('exist')
      .each(($checkbox) => {
        cy.wrap($checkbox).should('not.be.checked');
      });

    // Summary label shows "0 of ..."
    cy.get(SearchFilterByBUCommonLocators.selectedCountLabel).should('be.visible').and('contain.text', '0 of');
  }

  selectBusinessUnitsByNames(names: string[]): void {
    log('action', `Selecting Confiscation business units: ${names.join(', ') || '<none>'}`);

    for (const rawName of names) {
      const name = rawName.trim();

      cy.contains('td.govuk-table__cell label.govuk-checkboxes__label', name)
        .should('be.visible')
        .invoke('attr', 'for')
        .then((id) => {
          if (!id) {
            throw new Error(`No Confiscation checkbox id found for business unit name: "${name}"`);
          }

          log('info', `Checking Confiscation business unit "${name}" via checkbox id "${id}"`);
          cy.get(`#${id}`).check({ force: true });
        });
    }
  }

  verifyBusinessUnitsSelectedByNames(names: string[]): void {
    log('assert', `Verifying selected Confiscation business units: ${names.join(', ') || '<none>'}`);

    for (const rawName of names) {
      const name = rawName.trim();

      cy.contains('td.govuk-table__cell label.govuk-checkboxes__label', name)
        .should('be.visible')
        .invoke('attr', 'for')
        .then((id) => {
          if (!id) {
            throw new Error(`No Confiscation checkbox id found for business unit name: "${name}"`);
          }

          log('info', `Asserting Confiscation business unit "${name}" (id "${id}") is checked`);
          cy.get(`#${id}`).should('be.checked');
        });
    }
  }
}
