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
  paginationElement: 'opal-lib-moj-pagination',
  paginationText: '.moj-pagination__results',
  previousPageButton: '.moj-pagination__item--prev',
  nextPageButton: '.moj-pagination__item--next',
  paginationList: '.moj-pagination__list',
  paginationListItem: '.moj-pagination__item',
  paginationCurrentPage: '.moj-pagination__item--active',
  paginationPageNumber: (pageNum: number | string) => `.moj-pagination__item:contains("${pageNum}")`,

  // Messages
  noResultsMessage: '.govuk-grid-column-full-width > p:nth-of-type(1)',
  noResultsFollowupMessage: '.govuk-grid-column-full-width > p:nth-of-type(2)',
  tableStatusMessage: 'opal-lib-moj-sortable-table-status',
};
