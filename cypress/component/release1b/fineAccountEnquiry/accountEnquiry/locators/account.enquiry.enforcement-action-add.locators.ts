export const DOM_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  pageTitle: 'opal-lib-govuk-heading-with-caption > h1',
  accountInfo: 'opal-lib-govuk-heading-with-caption .govuk-caption-l',

  reasonInput: '#fines-acc-enf-action-add_reason',

  reasonLabel: 'label[for="fines-acc-enf-action-add_reason"]',
  reasonWelshInput: '#fines-acc-enf-action-add_reason_cy',
  reasonWelshLabel: 'label[for="fines-acc-enf-action-add_reason_cy"]',
  reasonWelshHint: '#fines-acc-enf-action-add_reason_cy-hint',

  reasonError: '#fines-acc-enf-action-add_reason-error-message',
  reasonWelshError: '#fines-acc-enf-action-add_reason_cy-error-message',

  hearingDateLabel: 'label[for="fines-acc-enf-action-add_hearing_date"]',
  hearingDateInput: '[name="fines-acc-enf-action-add_hearingdate"]',
  hearingDateToggle: '.moj-datepicker__toggle',
  hearingDateError: '#fines-acc-enf-action-add_hearingdate-error-message',
  hearingDateField: 'opal-lib-moj-date-picker',
  inlineError: '.govuk-error-message',

  daysInCustodyInput: '#fines-acc-enf-action-add_days',
  daysInCustodyError: '#fines-acc-enf-action-add_days-error-message',

  normalDeductionRateInput: '#fines-acc-enf-action-add_normaldeductionrate',
  normalDeductionRateError: '#fines-acc-enf-action-add_normaldeductionrate-error-message',

  collectionTypeFieldset: '#fines-acc-enf-action-add_collection_type',
  collectionTypeError: '#fines-acc-enf-action-add_collection_type-error-message',

  basisOfCommittalInput: '#fines-acc-enf-action-add_basisofcommittal',
  basisOfCommittalWelshLabel: 'label[for="fines-acc-enf-action-add_basisofcommittal_cy"]',
  basisOfCommittalWelshHint: '#fines-acc-enf-action-add_basisofcommittal_cy-hint',

  basisOCError: '#fines-acc-enf-action-add_basisofcommittal-error-message',
  basisOCWelshError: '#fines-acc-enf-action-add_basisofcommittal_cy-error-message',

  changeExistingPaymentTermsLegend: 'legend',
  changeExistingPaymentTermsYesRadio: '#fines-acc-enf-action-add_add_payment_terms-yes',
  changeExistingPaymentTermsNoRadio: '#fines-acc-enf-action-add_add_payment_terms-no',

  selectPaymentTermsLegend: 'legend',
  daysInDefaultLabel: 'label[for="fines-acc-enf-action-add_days_in_default"]',
  daysInDefaultInput: '#fines-acc-enf-action-add_days_in_default',
  dateDaysInDefaultImposedLabel: 'label',

  addPaymentTermsFieldset: '#fines-acc-enf-action-add_add_payment_terms',
  addPaymentTermsError: '#fines-acc-enf-action-add_add_payment_terms-error-message',

  errorSummary: '.govuk-error-summary',
  cancelLink: '.govuk-link',
  addEnforcementActionButton: '#submitForm',
} as const;
