/**
 * @file fines.filterBusinessUnit.locators.ts
 * @description
 * Selector map for the **Filter by business unit – Fines** page in HMCTS Opal.
 *
 * Defines locators for:
 * - “Select all” and individual business unit checkboxes
 * - Selection summary text
 *
 * @remarks
 * - All selectors are scoped to the `<app-fines-sa-search-filter-business-unit-form>`
 *   component to avoid clashes with other fines search pages.
 * - Intended to be consumed by Cypress actions/steps only (no direct use in tests).
 */

export const FinesFilterBusinessUnitLocators = {
  // ──────────────────────────────
  // Business unit selection
  // ──────────────────────────────

  /**
   * Container showing the selection summary text, e.g. "48 of 48 selected".
   * Appears directly under the form element.
   */
  selectionSummaryText: 'app-fines-sa-search-filter-business-unit-form form > div:first-of-type',

  /** Table element that lists all Fines business units. */
  businessUnitsTable: 'app-fines-sa-search-filter-business-unit-form table.govuk-table',

  /** Table body containing business unit rows. */
  businessUnitsTableBody: 'app-fines-sa-search-filter-business-unit-form table.govuk-table > tbody.govuk-table__body',

  /** All table rows for individual business units. */
  businessUnitRows: 'app-fines-sa-search-filter-business-unit-form tbody.govuk-table__body tr.govuk-table__row',

  /** "Fines business units" header cell containing the select-all checkbox. */
  businessUnitsHeaderCell:
    'app-fines-sa-search-filter-business-unit-form thead.govuk-table__head th.govuk-table__header',

  /** "Select all" checkbox for all Fines business units. */
  selectAllBusinessUnitsCheckbox: '#fsa_search_account_business_unit_ids',

  /** Label for the "Fines business units" select-all checkbox. */
  selectAllBusinessUnitsLabel: 'label[for="fsa_search_account_business_unit_ids"]',

  /** All individual business unit checkboxes within the table. */
  businessUnitCheckboxes:
    'app-fines-sa-search-filter-business-unit-form tbody.govuk-table__body .govuk-checkboxes__input',

  /** All labels associated with individual business unit checkboxes. */
  businessUnitLabels: 'app-fines-sa-search-filter-business-unit-form tbody.govuk-table__body .govuk-checkboxes__label',

  /**
   * Prefix for row IDs that wrap each business unit checkbox.
   * Combined dynamically in actions, e.g. `#business_unit_id_107`.
   */
  businessUnitRowIdPrefix: '#business_unit_id_',
};
