/**
 * @file search.filter-by-bu-fines.actions.ts
 * @description
 * Fines-specific actions for the Filter-by-Business-Unit page.
 */

import { FinesFilterBusinessUnitLocators } from '../../../../../shared/selectors/account-search/account.search.filter-by-bu-fines.locators';
import { SearchFilterByBUCommonLocators } from '../../../../../shared/selectors/account-search/account.search.filter-by-bu.common.locators';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

export type BusinessUnitMap = Map<string, string>;

const log = createScopedLogger('SearchFilterByBUFinesActions');

export class SearchFilterByBUFinesActions {
  /** Verifies the master checkbox and label are present */
  verifyMasterCheckboxPresent(): void {
    log('info', 'Verifying presence of Fines master checkbox and label');

    cy.get(FinesFilterBusinessUnitLocators.selectAllBusinessUnitsCheckbox).should('exist');
    cy.get(FinesFilterBusinessUnitLocators.selectAllBusinessUnitsLabel)
      .should('exist')
      .and('contain.text', 'Fines business units');
  }

  /** Verifies master checkbox is checked by default */
  verifyMasterCheckboxCheckedByDefault(): void {
    log('info', 'Verifying master Fines business units checkbox is checked by default');

    cy.get(FinesFilterBusinessUnitLocators.selectAllBusinessUnitsCheckbox).should('be.checked');
  }

  /** Verifies master checkbox is in expected state */
  verifyMasterCheckboxState(expectedChecked: boolean): void {
    log('info', `Verifying master checkbox state is: ${expectedChecked}`);

    cy.get(FinesFilterBusinessUnitLocators.selectAllBusinessUnitsCheckbox).should(
      expectedChecked ? 'be.checked' : 'not.be.checked',
    );
  }

  /**
   * Sets the master checkbox to a required state (checked / unchecked)
   */
  setMasterCheckboxState(shouldBeChecked: boolean): void {
    log('info', `Setting master checkbox state to: ${shouldBeChecked}`);

    cy.get(FinesFilterBusinessUnitLocators.selectAllBusinessUnitsCheckbox).then(($checkbox) => {
      const isChecked = $checkbox.is(':checked');

      // Avoid negated condition
      if (isChecked === shouldBeChecked) {
        log('info', 'Master checkbox already in desired state');
        return;
      }

      log('info', 'Toggling master checkbox');
      cy.wrap($checkbox).click();
    });
  }

  /** Toggles a business unit checkbox based on a map entry */
  toggleBusinessUnitFromMap(businessUnits: BusinessUnitMap, key: string): void {
    const id = businessUnits.get(key);

    if (!id) {
      throw new Error(`Business unit key "${key}" not found in map`);
    }

    log('info', `Toggling business unit checkbox for key "${key}" (id: ${id})`);

    const selector = `${FinesFilterBusinessUnitLocators.businessUnitRowIdPrefix}${id} input.govuk-checkboxes__input`;
    cy.get(selector).click();
  }

  /** Verifies all business units in map are checked */
  verifyBusinessUnitsChecked(businessUnits: BusinessUnitMap): void {
    log('info', `Verifying all business units in map are checked (count: ${businessUnits.size})`);

    for (const [key, id] of businessUnits.entries()) {
      log('info', `Checking business unit for key "${key}" (id: ${id})`);

      const selector = `${FinesFilterBusinessUnitLocators.businessUnitRowIdPrefix}${id} input.govuk-checkboxes__input`;
      cy.get(selector).should('be.checked');
    }
  }

  /** Verifies a single mapped business unit is checked */
  verifyBusinessUnitCheckedFromMap(businessUnits: BusinessUnitMap, key: string): void {
    const id = businessUnits.get(key);

    if (!id) {
      throw new Error(`Business unit key "${key}" not found in map`);
    }

    log('info', `Verifying business unit is checked for key "${key}" (id: ${id})`);

    const selector = `${FinesFilterBusinessUnitLocators.businessUnitRowIdPrefix}${id} input.govuk-checkboxes__input`;
    cy.get(selector).should('be.checked');
  }

  /**
   * Verifies the summary text contains: `X of `
   * where X = map size
   */
  verifySelectionSummaryCountMatchesMap(businessUnits: BusinessUnitMap): void {
    const expectedCount = businessUnits.size;

    log('info', `Verifying summary text contains "${expectedCount} of "`);

    cy.get(FinesFilterBusinessUnitLocators.selectionSummaryText)
      .invoke('text')
      .then((text) => {
        const cleaned = text.trim();
        log('info', `Summary text: "${cleaned}"`);
      });

    cy.get(FinesFilterBusinessUnitLocators.selectionSummaryText).should('contain.text', `${expectedCount} of `);
  }

  /**
   * Unchecks the master "Fines business units" checkbox (if currently checked).
   */
  unselectAllBusinessUnits(): void {
    log('action', 'Unselecting all Fines business units via master checkbox');
    this.setMasterCheckboxState(false);
  }

  /**
   * Asserts that no Fines business units are selected:
   * - Master checkbox is not checked
   * - No individual business unit checkboxes are checked
   * - Count label starts with "0 of"
   */
  verifyNoBusinessUnitsSelected(): void {
    log('assert', 'Verifying no Fines business units are selected');

    // Master not checked
    this.verifyMasterCheckboxState(false);

    // No row checkboxes checked
    cy.get(FinesFilterBusinessUnitLocators.businessUnitCheckboxes)
      .should('exist')
      .each(($checkbox) => {
        cy.wrap($checkbox).should('not.be.checked');
      });

    cy.get(SearchFilterByBUCommonLocators.selectedCountLabel).should('be.visible').and('contain.text', '0 of');
  }

  /**
   * Selects the given Fines business units by display name.
   *
   * @param names - Array of display names from the feature data table
   *                (e.g. ["Bedfordshire", "Bolton"]).
   */
  selectBusinessUnitsByNames(names: string[]): void {
    log('action', `Selecting Fines business units: ${names.join(', ') || '<none>'}`);

    for (const rawName of names) {
      const name = rawName.trim();

      cy.contains('td.govuk-table__cell label.govuk-checkboxes__label', name)
        .should('be.visible')
        .invoke('attr', 'for')
        .then((id) => {
          if (!id) {
            throw new Error(`No Fines checkbox id found for business unit name: "${name}"`);
          }

          log('info', `Checking Fines business unit "${name}" via checkbox id "${id}"`);
          cy.get(`#${id}`).check({ force: true });
        });
    }
  }

  /**
   * Verifies that each provided Fines business unit (by display name) is selected.
   *
   * @param names - Expected selected business unit names.
   */
  verifyBusinessUnitsSelectedByNames(names: string[]): void {
    log('assert', `Verifying selected Fines business units: ${names.join(', ') || '<none>'}`);

    for (const rawName of names) {
      const name = rawName.trim();

      cy.contains('td.govuk-table__cell label.govuk-checkboxes__label', name)
        .should('be.visible')
        .invoke('attr', 'for')
        .then((id) => {
          if (!id) {
            throw new Error(`No Fines checkbox id found for business unit name: "${name}"`);
          }

          log('info', `Asserting Fines business unit "${name}" (id "${id}") is checked`);
          cy.get(`#${id}`).should('be.checked');
        });
    }
  }
}
