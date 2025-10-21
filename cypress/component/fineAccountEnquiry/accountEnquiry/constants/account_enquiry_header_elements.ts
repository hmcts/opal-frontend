// Stable selectors / visible text hooks for the Defendant Details page.

export const ACCOUNT_ENQUIRY_HEADER_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  headingName: 'h1.govuk-heading-l',
  pageHeader: 'opal-lib-custom-page-header',

  // Buttons
  addNoteButton: 'button#addAccountNote',

  // Info sections
  summaryMetricBar: 'opal-lib-custom-summary-metric-bar',
  accountInfo: 'opal-lib-custom-account-information',

  // Visible labels used in assertions
  labelAccountType: 'Account type:',
  labelCaseNumber: 'PCR or case number:',
  labelBusinessUnit: 'Business Unit:',
  labelImposed: 'Imposed:',
  labelArrears: 'Arrears:',
  labelDefendant: 'Defendant',
  labelPaymentTerms: 'Payment terms',
  labelEnforcementStatus: 'Enforcement status',

  // Subnav / tabs
  subnav: 'opal-lib-moj-sub-navigation',
  atAGlanceTabComponent: 'app-fines-acc-defendant-details-at-a-glance-tab',

  // Conditional tag
  statusTag: '#status',

  // Enforcement status tag
  enforcementStatusTag: ':nth-child(1) > opal-lib-govuk-tag > #enforcement_status',

  // Links
  linkText: 'a[class="govuk-link govuk-link--no-visited-state"]',
  badgeBlue: 'span[class="govuk-!-margin-bottom-2 moj-badge moj-badge--blue"]',
  badgeRed: 'span[class="govuk-!-margin-bottom-2 moj-badge moj-badge--red"]',
};
