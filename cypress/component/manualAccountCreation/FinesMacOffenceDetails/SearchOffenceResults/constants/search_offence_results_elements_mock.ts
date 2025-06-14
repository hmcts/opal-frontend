export const DOM_ELEMENTS = {
  app: 'app-fines-mac-offence-details-search-offences-results-table-wrapper',
  heading: 'h1.govuk-heading-l',
  table: 'tbody tr',

  // Table headers
  codeHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Code"] button[data-index="0"]',
  shortTitleHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Short title"] button[data-index="1"]',
  actAndSectionHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Act and section"] button[data-index="2"]',
  usedFromHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Used from"] button[data-index="3"]',
  usedToHeader: 'th[opal-lib-moj-sortable-table-header][columnkey="Used to"] button[data-index="4"]',

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
  noResultsMessage: '.govuk-grid-column-full-width > p:nth-of-type(1)',
  noResultsFollowupMessage: '.govuk-grid-column-full-width > p:nth-of-type(2)',
  tableStatusMessage: 'opal-lib-moj-sortable-table-status',
};
