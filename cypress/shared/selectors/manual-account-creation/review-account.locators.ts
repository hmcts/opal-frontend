/**
 * @file review-account.locators.ts
 * @description Stable selectors for the Manual Account Creation **Check account details** page.
 *
 * @remarks
 * - Uses summary list ids exposed in the review components.
 * - Buttons use explicit ids set via `opal-lib-govuk-button`.
 */
export const ManualReviewAccountLocators = {
  header: 'h1.govuk-heading-l',
  checkAccountButton: '#checkAccountButton',
  submitForReviewButton: '#submitAccountButton',
  summaryList: (id: string) => `[summarylistid="${id}"]`,
  summaryRow: '.govuk-summary-list__row',
  summaryKey: '.govuk-summary-list__key',
  summaryValue: '.govuk-summary-list__value',
  offences: {
    impositionCells: 'td#imposition',
    creditorCells: 'td#creditor',
    amountImposedCells: 'td#amountImposed',
    amountPaidCells: 'td#amountPaid',
    balanceRemainingCells: 'td#balanceRemaining',
    totals: {
      heading: '#totalsHeading',
      amountImposed: '#totalAmountImposed',
      amountPaid: '#totalAmountPaid',
      balanceRemaining: '#totalBalanceRemaining',
    },
    minorCreditorToggle: 'a.govuk-link.govuk-link--no-visited-state',
    minorCreditorSummaryId: 'minorCreditorDataTable',
  },
} as const;
