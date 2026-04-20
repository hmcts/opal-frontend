/**
 * @file account.enquiry.payment-terms.locators.ts
 * @description
 * Shared selector map for the Account Enquiry payment-terms tab and related flows.
 *
 * @remarks
 * - Preserves the legacy export name used by component specs to keep migration mechanical.
 */
export const ACCOUNT_ENQUIRY_PAYMENT_TERMS_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  headingName: 'h1.govuk-heading-l',
  pageHeader: 'opal-lib-custom-page-header',
  headerLabel: '[opal-lib-custom-account-information-item-label]',
  headerValue: '[opal-lib-custom-account-information-item-value]',

  // Buttons
  addNoteButton: 'button[id$="addAccountNote"]',

  // Info sections
  summaryMetricBar: 'opal-lib-custom-summary-metric-bar',
  accountInfo: 'opal-lib-custom-account-information',
  parentGuardianTag: '#status',

  // Tabs
  tabName: '[subnavitemid="payment-terms-tab"] > .moj-sub-navigation__link',

  // Links
  paymentTermsLink: '.govuk-link',

  // Table labels
  tableTitle: '.govuk-summary-card__title',
  payByDate: '#payment-termsEffective-dateValue',
  daysInDefault: '#payment-termsDays-in-defaultValue',
  dateDaysInDefaultImposed: '#payment-termsDate-days-in-default-were-imposedValue',
  paymentCardRequested: '#payment-termsPayment-card-last-requestedValue',
  startDate: '#payment-termsEffective-dateValue',
  instalmentAmount: '#payment-termsInstalment-amountValue',
  instalmentFrequency: '#payment-termsInstalment-periodValue',
  instalmentStartDate: '#payment-termsEffective-dateValue',
  lumpSumAmount: '#payment-termsLump-sum-amountValue',
  dateLastAmended: '#payment-terms-amendmentsDate-last-amendedValue',
  lastAmendedBy: '#payment-terms-amendmentsLast-amended-byValue',
  amendmentReason: '#payment-terms-amendmentsAmendement-reasonValue',
} as const;
