/**
 * @file account.enquiry.impositions.locators.ts
 * @description
 * Shared selector map for the Account Enquiry Impositions tab.
 *
 * @remarks
 * - Uses the stable IDs already rendered by the Angular table rows.
 * - Keeps routed component and e2e tests aligned on the same hooks.
 */
export const ACCOUNT_ENQUIRY_IMPOSITIONS_ELEMENTS = {
  routerOutlet: 'router-outlet',
  pageHeader: 'opal-lib-custom-page-header',
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  headingName: 'h1.govuk-heading-l',
  summaryMetricBar: 'opal-lib-custom-summary-metric-bar',
  accountInfo: 'opal-lib-custom-account-information',
  tabName: '[subnavitemid="impositions-tab"] > .moj-sub-navigation__link',
  component: 'app-fines-acc-defendant-details-impositions-tab',
  heading: 'app-fines-acc-defendant-details-impositions-tab h2',
  table: 'app-fines-acc-defendant-details-impositions-tab opal-lib-moj-sortable-table',
  rows: 'app-fines-acc-defendant-details-impositions-tab tr[opal-lib-moj-sortable-table-row]',
  zeroBalanceRow: 'app-fines-acc-defendant-details-impositions-tab tr.govuk-light-grey-background-colour',
  emptyState: 'app-fines-acc-defendant-details-impositions-tab p.govuk-body',
  readOnlyInputs: 'input, textarea, select, [contenteditable="true"]',
  pagination: '#fines-acc-defendant-details-impositions-pagination',
  paginationText: '.moj-pagination__results',
  paginationCurrentPage: '.govuk-pagination__item--current',
  nextPageButton: '.govuk-pagination__next a.govuk-pagination__link',
  minorCreditorLink: '#imposition-creditor-1 a',
} as const;

export const getImpositionsCell = (columnKey: string, rowIndex: number): string =>
  `#imposition-${columnKey}-${rowIndex}`;

export const getImpositionsPaginationItem = (pageNumber: number | string): string =>
  `.govuk-pagination__item a.govuk-pagination__link:contains("${pageNumber}"), .govuk-pagination__item--current:contains("${pageNumber}")`;
