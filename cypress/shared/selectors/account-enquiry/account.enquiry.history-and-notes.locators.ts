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
  tabRoot: 'app-fines-acc-defendant-details-history-and-notes-tab',
  tabHeading: '.govuk-\\!-margin-bottom-2',
  filterDetails: 'details.govuk-details',
  filterSummaryText: '.govuk-details__summary-text',
  filterButton: '#history-and-notes-filter-button',
  table: 'opal-lib-moj-sortable-table',
  tableHeadings: 'opal-lib-moj-sortable-table thead',
  tableRows: 'opal-lib-moj-sortable-table tbody tr',
  detailsLinks: '#history-and-notes-details-0 a',
  scrollPane: 'opal-lib-custom-horizontal-scroll-pane',
  noResultsMessage: '#history-and-notes-no-results',
  pagination: 'opal-lib-moj-pagination',
  dateHeader: 'opal-lib-moj-sortable-table thead th[aria-sort]',
  dateHeaderButton: 'opal-lib-moj-sortable-table thead th[aria-sort] button[data-index="0"]',
  firstDateCell: '#history-and-notes-date-0',
  secondDateCell: '#history-and-notes-date-1',
  thirdDateCell: '#history-and-notes-date-2',
  firstDetailsCell: '#history-and-notes-details-0',
  secondDetailsCell: '#history-and-notes-details-1',
  thirdDetailsCell: '#history-and-notes-details-2',
  firstAmountCell: '#history-and-notes-amount-0',
  secondAmountCell: '#history-and-notes-amount-1',
  thirdAmountCell: '#history-and-notes-amount-2',
  firstTypeCell: '#history-and-notes-type-0',
  secondTypeCell: '#history-and-notes-type-1',
  thirdTypeCell: '#history-and-notes-type-2',
  firstUserCell: '#history-and-notes-user-0',
  secondUserCell: '#history-and-notes-user-1',
  thirdUserCell: '#history-and-notes-user-2',
  detailsLine2: '.govuk-\\!-margin-top-1',

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
