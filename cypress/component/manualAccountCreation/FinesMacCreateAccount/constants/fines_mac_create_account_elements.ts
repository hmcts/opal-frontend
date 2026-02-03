export const DOM_ELEMENTS = {
  createAccountCaption: 'span.govuk-caption-l',
  heading: 'h1.govuk-heading-l',
  app: 'div.govuk-grid-column-two-thirds',
  errorSummary: '.govuk-error-summary',
  // Business unit
  businessUnitHint: 'div[id = "fm_create_account_business_unit_id-hint"]',
  businessUnitInput: 'input[id = "fm_create_account_business_unit_id-autocomplete"]',
  businessUnitLabel:
    'label[for = "fm_create_account_business_unit_id-autocomplete"], label[for="fm_create_account_business_unit_id"]',
  businessUnitAutoComplete: 'ul[id = "fm_create_account_business_unit_id-autocomplete__listbox"]',
  //account type
  accountTypeHeading: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
  fineInput: 'input[name="fm_create_account_account_type"][value="Fine"]',
  fineLabel: 'label[for = "fm_create_account_account_type-Fine"]',
  fixedPenaltyInput: 'input[name="fm_create_account_account_type"][value="Fixed Penalty"]',
  fixedPenaltyLabel: 'label[for = "fm_create_account_account_type-FixedPenalty"]',
  conditionalCautionInput: 'input[name="fm_create_account_account_type"][value="Conditional Caution"]',
  conditionalCautionLabel: 'label[for = "fm_create_account_account_type-ConditionalCaution"]',

  //fine
  defendantTypeTitle: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
  defendantTypeHint: 'div[id = "fm_create_account_fine_defendant_type-hint"]',
  adultOrYouthInput: 'input[name="fm_create_account_fine_defendant_type"][value="adultOrYouthOnly"]',
  adultOrYouthLabel: 'label[for = "fm_create_account_fine_defendant_type-adultOrYouthOnly"]',
  parentOrGuardianToPayInput: 'input[name="fm_create_account_fine_defendant_type"][value="pgToPay"]',
  parentOrGuardianToPayLabel: 'label[for = "fm_create_account_fine_defendant_type-pgToPay"]',
  companyInput: 'input[name="fm_create_account_fine_defendant_type"][value="company"]',
  companyLabel: 'label[for = "fm_create_account_fine_defendant_type-company"]',

  //fixed penalty
  FPdefendantTypeHint: 'div[id = "fm_create_account_fixed_penalty_defendant_type-hint"]',
  FPAdultOrYouthInput: 'input[name="fm_create_account_fixed_penalty_defendant_type"][value="adultOrYouthOnly"]',
  FPAdultOrYouthLabel: 'label[for = "fm_create_account_fixed_penalty_defendant_type-adultOrYouthOnly"]',
  FPCompany: 'input[name="fm_create_account_fixed_penalty_defendant_type"][value="company"]',
  FPCompanyLabel: 'label[for = "fm_create_account_fixed_penalty_defendant_type-company"]',

  //conditional caution
  ConditionalCautionHint: 'div[id = "fm_create_account_account_type-ConditionalCaution-item-hint"]',

  continueButton: 'button[id = "submitForm"]',
  cancelLink: 'a.govuk-link.button-link',
};
