export const DOM_ELEMENTS = {
  app: 'div.govuk-grid-column-full',
  heading: 'h1.govuk-heading-l',
  pageHeader: 'opal-lib-custom-page-header',
  createAccountButton: '#create-account-button, button[buttonid="create-account-button"]',
  navigationLinks: 'a.moj-sub-navigation__link',

  rejectedIcon: 'span[id = "inputter-rejected-tab-rejected-count"]',
  statusHeading: 'h2.govuk-heading-m',
  tableCaption: '.moj-pagination__results',
  table: 'table.govuk-table',
  tableHeadings: 'th.govuk-table__header',

  tableRow: 'table.govuk-table>tbody>tr',
  defendant: 'td[id = "defendant"]',
  dob: 'td[id = "dob"]',
  deleted: 'td[id = "changedDate"]',
  created: 'td[id = "createdDate"]',
  accountType: 'td[id = "accountType"]',
  businessUnit: 'td[id = "businessUnit"]',

  previousPageButton: '.govuk-pagination__prev a.govuk-pagination__link',
  nextPageButton: '.govuk-pagination__next a.govuk-pagination__link',
  //Added as Page Number is now dynamic
  paginationPageNumber: (pageNum: number | string) =>
    `.govuk-pagination__item a.govuk-pagination__link:contains("${pageNum}"), .govuk-pagination__item--current:contains("${pageNum}")`,
  rejectedAccounts: 'a.govuk-link',
};
