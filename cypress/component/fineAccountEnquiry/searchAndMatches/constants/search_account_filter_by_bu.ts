// constants/search_account_filter_by_bu.ts
export const DOM_ELEMENTS = {
  // Page
  app: 'app-fines-sa-search-filter-business-unit-form',
  heading: 'h1.govuk-heading-l',

  // Tabs
  tabLink: 'a.moj-sub-navigation__link',
  finesTabText: 'Fines',
  confiscationTabText: 'Confiscation',

  // Panels / counters
  selectedCounter: 'form > div:first-of-type',

  // Table
  table: 'table.govuk-table',
  tableBody: 'table.govuk-table > tbody.govuk-table__body',
  tableRows: 'table.govuk-table > tbody.govuk-table__body tr.govuk-table__row',
  rowLabel: '.govuk-checkboxes__label',
  rowCheckbox: '.govuk-checkboxes__input',

  // Master checkbox label in table header
  masterCheckboxLabel: 'th .govuk-checkboxes__label',
  finesMasterText: 'Fines business units',
  confMasterText: 'Confiscation business units',

  // Buttons/links
  saveButton: 'button#submitForm',
  cancelLink: 'a.govuk-link.button-link',

  // error summary
  errorSummary: 'opal-lib-govuk-error-summary, .govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  errorSummaryList: '.govuk-error-summary__list',
  exactErrorText: 'You must select at least one business unit',
};
