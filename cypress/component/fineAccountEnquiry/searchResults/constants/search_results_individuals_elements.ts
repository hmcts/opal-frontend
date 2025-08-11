export const DOM_ELEMENTS = {
  heading: 'h1.govuk-heading-l',
  backLink: 'opal-lib-govuk-back-link',
  
  // No results message elements (based on actual template structure)
  noResultsHeading: 'h2.govuk-heading-m',
  noResultsText: 'p.govuk-body-m',
  noResultsMessage: '.govuk-grid-column-full-width > p:nth-of-type(1)',
  noResultsFollowupMessage: '.govuk-grid-column-full-width > p:nth-of-type(2)',
  checkSearchLink: 'a.govuk-link',
  
  // Too many results message elements (AC3 - more than 100 results)
  tooManyResultsHeading: 'h2.govuk-heading-m',
  tooManyResultsText: 'p.govuk-body-m',
  addMoreInfoLink: 'a.govuk-link',
  
  // Table wrapper when results exist
  tableWrapper: 'app-fines-sa-results-defendant-table-wrapper',
  table: 'tbody tr',
  
  // Table column headers (AC4)
  accountHeader: 'th[columnkey="Account"]',
  nameHeader: 'th[columnkey="Name"]',
  aliasesHeader: 'th[columnkey="Aliases"]',
  dobHeader: 'th[columnkey="Date of birth"]',
  addressHeader: 'th[columnkey="Address line 1"]',
  postcodeHeader: 'th[columnkey="Postcode"]',
  niNumberHeader: 'th[columnkey="NI number"]',
  parentGuardianHeader: 'th[columnkey="Parent or guardian"]',
  businessUnitHeader: 'th[columnkey="Business unit"]',
  refHeader: 'th[columnkey="Ref"]',
  enfHeader: 'th[columnkey="Enf"]',
  balanceHeader: 'th[columnkey="Balance"]',
  
  // Table cell data (AC4)
  accountCell: 'td[id="accountNumber"]',
  nameCell: 'td[id="name"]',
  aliasesCell: 'td[id="aliases"]',
  dobCell: 'td[id="dateOfBirth"]',
  addressCell: 'td[id="addressLine1"]',
  postcodeCell: 'td[id="postcode"]',
  niNumberCell: 'td[id="nationalInsuranceNumber"]',
  parentGuardianCell: 'td[id="parentOrGuardian"]',
  businessUnitCell: 'td[id="businessUnit"]',
  refCell: 'td[id="ref"]',
  enfCell: 'td[id="enf"]',
  balanceCell: 'td[id="balance"]',
  
  // Tabs (for multi-type results)
  tabs: 'opal-lib-govuk-tabs',
  tabsList: '.govuk-tabs__list',
  individualsTab: '[id="tab-individuals"]',
  companiesTab: '[id="tab-companies"]',
  minorCreditorsTab: '[id="tab-minor-creditors"]',
  
  // Results panels
  individualsPanel: '[id="individuals"]',
  companiesPanel: '[id="companies"]',
  minorCreditorsPanel: '[id="minor-creditors"]',
  
  // Pagination (if applicable)
  paginationElement: 'opal-lib-moj-pagination',
  paginationText: '.moj-pagination__results',
  previousPageButton: '.moj-pagination__item--prev',
  nextPageButton: '.moj-pagination__item--next',
  paginationList: '.moj-pagination__list',
  paginationListItem: '.moj-pagination__item',
  paginationCurrentPage: '.moj-pagination__item--active',
  paginationPageNumber: (pageNum: number | string) => `.moj-pagination__item:contains("${pageNum}")`,
};
