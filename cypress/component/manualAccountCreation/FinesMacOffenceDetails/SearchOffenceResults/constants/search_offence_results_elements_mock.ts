export const DOM_ELEMENTS = {
  app: 'app-fines-mac-offence-details-search-offences-results-table-wrapper',
  heading: 'h1.govuk-heading-l',
  table: 'tbody tr',

  // Table headers
  codeHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Code"] button[data-index="0"]',
  shortTitleHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Short title"]',
  actAndSectionHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Act and section"]',
  usedFromHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Used from"]',
  usedToHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Used to"]',

  // Table cells
  codeCell: 'td[opal-lib-moj-sortable-table-row-data][id="code"]',
  shortTitleCell: 'td[opal-lib-moj-sortable-table-row-data][id="shortTitle"]',
  actAndSectionCell: 'td[opal-lib-moj-sortable-table-row-data][id="actAndSection"]',
  usedFromCell: 'td[opal-lib-moj-sortable-table-row-data][id="usedFrom"]',
  usedToCell: 'td[opal-lib-moj-sortable-table-row-data][id="usedTo"]',

  // Links and buttons
  copyCodeLink: 'a.govuk-link',
  backLink: 'opal-lib-govuk-back-link',

  // Pagination
  paginationElement: 'nav[role="navigation"][aria-label="results"]',
  paginationText: '.govuk-table__caption, .moj-pagination__results',
  previousPageButton: '.govuk-pagination__prev a[rel="prev"]',
  nextPageButton: '.govuk-pagination__next a[rel="next"]',
  paginationList: '.govuk-pagination__list',
  paginationListItem: '.govuk-pagination__item',
  paginationCurrentPage: '.govuk-pagination__item--current',
  paginationPage1: '.govuk-pagination__item:nth-child(1)',
  paginationPage2: '.govuk-pagination__item:nth-child(2)',
  paginationPage3: '.govuk-pagination__item:nth-child(3)',
  paginationPage4: '.govuk-pagination__item:nth-child(4)',

  // Messages
  noResultsMessage: 'p:contains("There are no matching results.")',
  noResultsFollowupMessage: 'p:contains("Check your search and try again.")',
  tableStatusMessage: 'opal-lib-moj-sortable-table-status',
  clipboardConfirmation: '.moj-banner--success, .govuk-notification-banner--success',
};
