/**
 * @file account.enquiry.history-and-notes.locators.ts
 * @description
 * Shared selector map for the Account Enquiry History and notes tab.
 */
export const ACCOUNT_ENQUIRY_HISTORY_AND_NOTES_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  headingName: 'h1.govuk-heading-l',
  pageHeader: 'opal-lib-custom-page-header',
  accountInfo: 'opal-lib-custom-account-information',
  summaryMetricBar: 'opal-lib-custom-summary-metric-bar',

  // Tabs
  tabName: '[subnavitemid="history-and-notes-tab"] > .moj-sub-navigation__link',

  // Tab content
  tabHeading: '.govuk-\\!-margin-bottom-2',
  filterDetails: 'details.govuk-details',
  filterSummaryText: '.govuk-details__summary-text',
  filterButton: '#history-and-notes-filter-button',

  // Date filters
  dateFromInput: '#dateFrom',
  dateToInput: '#dateTo',

  // Error messages
  errorSummary: '.govuk-error-summary',
  dateToErrorMessage: '#dateTo-error-message',
  dateFromErrorMessage: '#dateFrom-error-message',

  // Category filters
  categoriesFieldset: '#history-and-notes-categories',
  amendmentsCheckbox: '#history-and-notes-category-amendments',
  enforcementActionsCheckbox: '#history-and-notes-category-enforcements',
  financialCheckbox: '#history-and-notes-category-financial',
  notesCheckbox: '#history-and-notes-category-notes',
  paymentTermsCheckbox: '#history-and-notes-category-paymentTerms',
} as const;
