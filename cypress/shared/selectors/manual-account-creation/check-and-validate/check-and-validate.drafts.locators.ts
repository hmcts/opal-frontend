/**
 * @file check-and-validate.drafts.locators.ts
 * @description Stable selectors for the **Check and Validate Draft Accounts** page (checker view).
 */
export const CheckAndValidateDraftsLocators = {
  app: 'div.govuk-grid-column-full',
  heading: 'h1.govuk-heading-l',
  navigationLinks: 'a.moj-sub-navigation__link',
  failedCountIcon: 'span[id = "checker-failed-tab-failed-count"]',
  statusHeading: 'h2.govuk-heading-m',
  tableHeadings: 'th.govuk-table__header',
  tableCaption: 'caption.govuk-table__caption, .moj-pagination__results',
  table: 'table.govuk-table',
  tableRow: 'table.govuk-table>tbody>tr',
  defendant: 'td[id = "defendant"]',
  dob: 'td[id = "dob"]',
  created: 'td[id = "createdDate"]',
  changedDate: 'td[id = "changedDate"]',
  accountType: 'td[id = "accountType"]',
  businessUnit: 'td[id = "businessUnit"]',
  submittedBy: 'td[id = "submittedBy"]',
  paginationLinks: 'a.govuk-link.govuk-pagination__link',
  paginationLinksNext: '.govuk-pagination__next',
  paginationLinksPrevious: '.govuk-pagination__prev',
  paginationPageNumber: (pageNum: number | string) =>
    `.govuk-pagination__item a.govuk-pagination__link:contains("${pageNum}"), .govuk-pagination__item--current:contains("${pageNum}"), .govuk-pagination__item:contains("${pageNum}")`,
  accountStatus: 'strong[id="status"]',
  reviewHistory: 'h2.govuk-heading-m, h3.govuk-heading-m',
  reviewComponent: 'app-fines-mac-review-account-history',
  tabs: {
    container: '#checker-tabs',
    toReview: '[subnavitemid="checker-to-review-tab"] a',
    rejected: '[subnavitemid="checker-rejected-tab"] a',
    deleted: '[subnavitemid="checker-deleted-tab"] a',
    failed: '[subnavitemid="checker-failed-tab"] a',
    byText: (tabName: string) => `#checker-tabs a:contains("${tabName}")`,
  },
} as const;
