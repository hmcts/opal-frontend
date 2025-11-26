/**
 * @file fines.filter-by-bu-confiscation.locators.ts
 * @description
 * Selector map for the **Filter by business unit – Confiscation** view
 * within the Fines SA search flow in HMCTS Opal.
 *
 * Defines locators for:
 * - “Select all” and individual confiscation business unit checkboxes
 * - Selection summary text
 *
 * @remarks
 * - All selectors are scoped to the `<app-fines-sa-search-filter-business-unit-form>`
 *   component to avoid clashes with other fines search pages.
 * - Intended to be consumed by Cypress actions/steps only (no direct use in tests).
 */

export const FinesFilterBusinessUnitConfiscationLocators = {
  // ──────────────────────────────
  // Business unit selection (Confiscation)
  // ──────────────────────────────

  /**
   * Container showing the selection summary text, e.g. "6 of 6 selected".
   * Appears directly under the form element.
   */
  selectionSummaryText: 'app-fines-sa-search-filter-business-unit-form form > div:first-of-type',

  /** Table element that lists all confiscation business units. */
  businessUnitsTable: 'app-fines-sa-search-filter-business-unit-form table.govuk-table',

  /** Table body containing confiscation business unit rows. */
  businessUnitsTableBody: 'app-fines-sa-search-filter-business-unit-form table.govuk-table > tbody.govuk-table__body',

  /** All table rows for individual confiscation business units. */
  businessUnitRows: 'app-fines-sa-search-filter-business-unit-form tbody.govuk-table__body tr.govuk-table__row',

  /** Header cell containing the "Confiscation business units" select-all checkbox. */
  businessUnitsHeaderCell:
    'app-fines-sa-search-filter-business-unit-form thead.govuk-table__head th.govuk-table__header',

  /** Visually-hidden span associated with the select-all checkbox. */
  selectAllBusinessUnitsVisuallyHiddenLabel: '#confiscation_select_all_label',

  /** "Select all" checkbox for all confiscation business units. */
  selectAllBusinessUnitsCheckbox: '#fsa_search_account_business_unit_ids',

  /** Label for the "Confiscation business units" select-all checkbox. */
  selectAllBusinessUnitsLabel: 'label[for="fsa_search_account_business_unit_ids"]',

  /** All individual confiscation business unit checkboxes within the table. */
  businessUnitCheckboxes:
    'app-fines-sa-search-filter-business-unit-form tbody.govuk-table__body .govuk-checkboxes__input',

  /** All labels associated with individual confiscation business unit checkboxes. */
  businessUnitLabels: 'app-fines-sa-search-filter-business-unit-form tbody.govuk-table__body .govuk-checkboxes__label',

  /**
   * Prefix for row IDs that wrap each confiscation business unit checkbox.
   * Combined dynamically in actions, e.g. `#business_unit_id_109`.
   */
  businessUnitRowIdPrefix: '#business_unit_id_',
};
