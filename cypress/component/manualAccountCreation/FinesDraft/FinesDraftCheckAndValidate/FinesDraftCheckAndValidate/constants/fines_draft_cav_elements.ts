export const DOM_ELEMENTS = {
  app: 'div.govuk-grid-column-full',
  heading: 'h1.govuk-heading-l',
  navigationLinks: 'a.moj-sub-navigation__link',

  failedCountIcon: 'span[id = "checker-failed-tab-failed-count"]',

  statusHeading: 'h2.govuk-heading-m',
  tableHeadings: 'th.govuk-table__header',
  tableCaption: '.moj-pagination__results',
  table: 'table.govuk-table',

  tableRow: 'table.govuk-table>tbody>tr',
  defendant: 'td[id = "defendant"]',
  dob: 'td[id = "dob"]',
  created: 'td[id = "createdDate"]',
  changed: 'td[id = "changedDate"]',
  accountType: 'td[id = "accountType"]',
  businessUnit: 'td[id = "businessUnit"]',
  submittedBy: 'td[id = "submittedBy"]',
  deleted: 'td[id = "changedDate"]',

  paginationLinks: '.moj-pagination__list',
  paginationPageNumber: (pageNum) => `.moj-pagination__item:contains("${pageNum}")`,

  accountStatus: 'strong[id="status"]',
  reviewHistory: 'h3.govuk-heading-m govuk-!-margin-top-4',
  reviewComponent: 'app-fines-mac-review-account-history',
};
