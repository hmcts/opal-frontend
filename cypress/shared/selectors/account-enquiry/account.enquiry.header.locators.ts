/**
 * @file account.enquiry.header.locators.ts
 * @description
 * Shared selector and text-hook map for the Account Enquiry header shell and
 * shared summary widgets.
 *
 * @remarks
 * - Preserves the legacy export name used by component specs to keep migration mechanical.
 * - Includes a small number of visible-text hooks that existing tests assert directly.
 */
export const ACCOUNT_ENQUIRY_HEADER_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  headingName: 'h1.govuk-heading-l',
  pageHeader: 'opal-lib-custom-page-header',

  // Buttons
  addNoteButton: 'button#defendant-addAccountNote',
  minorCreditorAddNoteButton: 'button#minor-creditor-addAccountNote',
  addPaymentHoldButton: 'button#addPaymentHold',
  removePaymentHoldButton: 'button#removePaymentHold',

  // Info sections
  summaryMetricBar: 'opal-lib-custom-summary-metric-bar',
  summaryMetricBarItem: 'opal-lib-custom-summary-metric-bar-item',
  accountInfo: 'opal-lib-custom-account-information',
  sectionHeading: 'h2',
  fieldHeading: 'h3',
  fieldValue: 'p',
  readOnlyFields: 'input, textarea, select, [contenteditable="true"]',

  // Visible labels used in assertions
  labelAccountType: 'Account type:',
  labelCaseNumber: 'PCR or case number:',
  labelBusinessUnit: 'Business Unit:',
  labelImposed: 'Imposed:',
  labelArrears: 'Arrears:',
  labelAwarded: 'Awarded:',
  labelPaidOut: 'Paid out:',
  labelAwaitingPayout: 'Awaiting payout:',
  labelOutstanding: 'Outstanding:',
  labelDefendant: 'Defendant',
  labelPaymentTerms: 'Payment terms',
  labelEnforcementStatus: 'Enforcement status',
  labelMinorCreditor: 'Minor creditor',
  labelDefendantAccount: 'Defendant account',
  labelPayoutStatus: 'Payout status',
  labelName: 'Name',
  labelAddress: 'Address',
  labelDefendantName: 'Defendant name',
  labelBacsDetails: 'BACS details',
  labelAddPaymentHold: 'Add payment hold',
  labelRemovePaymentHold: 'Remove payment hold',
  labelAddPaymentHoldConfirmation: 'Do you want to add a payment hold?',
  labelRemovePaymentHoldConfirmation: 'Do you want to remove the payment hold?',
  labelYesAddHold: 'Yes - add hold',
  labelYesRemoveHold: 'Yes - remove hold',
  labelNoCancel: 'No - cancel',
  labelProvided: 'Provided',
  labelNotProvided: 'Not provided',

  // Subnav / tabs
  subnav: 'opal-lib-moj-sub-navigation',
  atAGlanceTabComponent: 'app-fines-acc-defendant-details-at-a-glance-tab',
  minorCreditorAtAGlanceTabComponent: 'app-fines-acc-minor-creditor-details-at-a-glance-tab',

  // Conditional tag
  statusTag: '#status',

  // Enforcement status tag
  enforcementStatusTag: ':nth-child(1) > opal-lib-govuk-tag > #enforcement_status',

  // Links
  cancelLink: 'a.govuk-link',
  linkText: 'a[class="govuk-link govuk-link--no-visited-state"]',
  badgeBlue: 'span[class="govuk-!-margin-bottom-2 moj-badge moj-badge--blue"]',
  badgeRed: 'span[class="govuk-!-margin-bottom-2 moj-badge moj-badge--red"]',

  // Minor creditor info fields
  minorCreditorAccountType: '#minor-creditor-account-type',
  minorCreditorBusinessUnit: '#minor-creditor-business-unit',
} as const;
