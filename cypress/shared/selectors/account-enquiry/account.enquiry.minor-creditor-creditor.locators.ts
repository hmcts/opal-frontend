/**
 * @file account.enquiry.minor-creditor-creditor.locators.ts
 * @description
 * Shared selector map for the Account Enquiry minor creditor creditor tab.
 */
export const MINOR_CREDITOR_CREDITOR_DETAILS = {
  component: 'app-fines-acc-minor-creditor-details-creditor-tab',
  sectionHeading: 'app-fines-acc-minor-creditor-details-creditor-tab h2',
  summaryCardTitle: 'app-fines-acc-minor-creditor-details-creditor-tab .govuk-summary-card__title',
  changeLink:
    'app-fines-acc-minor-creditor-details-creditor-tab a.govuk-link.govuk-link--no-visited-state.govuk-\\!-margin-bottom-0',
  nameRow: '[summaryListRowId="creditor-name"]',
  addressRow: '[summaryListRowId="creditor-address"]',
  paymentMethodRow: '[summaryListRowId="creditor-payment-method"]',
  nameOnAccountRow: '[summaryListRowId="creditor-payment-name-on-account"]',
  sortCodeRow: '[summaryListRowId="creditor-payment-sort-code"]',
  accountNumberRow: '[summaryListRowId="creditor-payment-account-number"]',
  paymentReferenceRow: '[summaryListRowId="creditor-payment-reference"]',
  permissionMessage: 'app-fines-acc-minor-creditor-details-creditor-tab p.govuk-\\!-font-size-19',
} as const;
