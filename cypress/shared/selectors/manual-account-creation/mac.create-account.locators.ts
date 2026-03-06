/**
 * @file mac.create-account.locators.ts
 * @description Selector map for the Manual Account Creation **Business unit and defendant type** start page.
 *
 * @remarks
 * - Covers business unit autocomplete, account type/defendant type radios, and navigation CTAs.
 * - Used by Cypress actions/flows to keep feature steps selector-free.
 */
export const MacCreateAccountLocators = {
  backLink: '.govuk-back-link',
  createAccountCaption: 'span.govuk-caption-l',
  heading: 'h1.govuk-heading-l',
  app: 'div.govuk-grid-column-two-thirds',
  errorSummary: '.govuk-error-summary',
  pageHeader: 'h1.govuk-heading-l',
  businessUnitHint: 'div[id="fm_create_account_business_unit_id-hint"]',
  businessUnitInput: 'input[id="fm_create_account_business_unit_id-autocomplete"]',
  businessUnitLabel:
    'label[for="fm_create_account_business_unit_id-autocomplete"], label[for="fm_create_account_business_unit_id"]',
  businessUnitAutoComplete: 'ul[id="fm_create_account_business_unit_id-autocomplete__listbox"], ul[role="listbox"]',
  businessUnitDefault: 'p',
  businessUnit: {
    container: 'opal-lib-alphagov-accessible-autocomplete[inputname="fm_create_account_business_unit_id"]',
    // The accessible autocomplete renders a text input with the provided id/name; older renders append "-autocomplete".
    input:
      'input[id="fm_create_account_business_unit_id-autocomplete"], input[name="fm_create_account_business_unit_id"], input[id="fm_create_account_business_unit_id"]',
    listbox: 'ul[id="fm_create_account_business_unit_id-autocomplete__listbox"], ul[role="listbox"]',
  },
  accountTypeHeading: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
  fineInput: 'input[name="fm_create_account_account_type"][value="Fine"]',
  fineLabel: 'label[for="fm_create_account_account_type-Fine"]',
  fixedPenaltyInput: 'input[name="fm_create_account_account_type"][value="Fixed Penalty"]',
  fixedPenaltyLabel: 'label[for="fm_create_account_account_type-FixedPenalty"]',
  conditionalCautionInput: 'input[name="fm_create_account_account_type"][value="Conditional Caution"]',
  conditionalCautionLabel: 'label[for="fm_create_account_account_type-ConditionalCaution"]',
  accountType: {
    fine: 'input[name="fm_create_account_account_type"][value="Fine"], input[id="fm_create_account_account_type-Fine"]',
    fixedPenalty:
      'input[name="fm_create_account_account_type"][value="Fixed Penalty"], input[id="fm_create_account_account_type-FixedPenalty"]',
    conditionalCaution:
      'input[name="fm_create_account_account_type"][value="Conditional Caution"], input[id="fm_create_account_account_type-ConditionalCaution"]',
  },
  defendantTypeTitle: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
  defendantTypeHint: 'div[id="fm_create_account_fine_defendant_type-hint"]',
  adultOrYouthInput: 'input[name="fm_create_account_fine_defendant_type"][value="adultOrYouthOnly"]',
  adultOrYouthLabel: 'label[for="fm_create_account_fine_defendant_type-adultOrYouthOnly"]',
  parentOrGuardianToPayInput: 'input[name="fm_create_account_fine_defendant_type"][value="pgToPay"]',
  parentOrGuardianToPayLabel: 'label[for="fm_create_account_fine_defendant_type-pgToPay"]',
  companyInput: 'input[name="fm_create_account_fine_defendant_type"][value="company"]',
  companyLabel: 'label[for="fm_create_account_fine_defendant_type-company"]',
  defendantType: {
    adultOrYouth: 'input[name$="_defendant_type"][value="adultOrYouthOnly"], input[id$="-adultOrYouthOnly"]',
    parentOrGuardianToPay: 'input[name$="_defendant_type"][value="pgToPay"], input[id$="-pgToPay"]',
    company: 'input[name$="_defendant_type"][value="company"], input[id$="-company"]',
  },
  defendantTypePanel: {
    fine: '#fm_create_account_fine_defendant_type_conditional',
    fixedPenalty: '#fm_create_account_fixed_penalty_defendant_type_conditional',
  },
  FPdefendantTypeHint: 'div[id="fm_create_account_fixed_penalty_defendant_type-hint"]',
  FPAdultOrYouthInput: 'input[name="fm_create_account_fixed_penalty_defendant_type"][value="adultOrYouthOnly"]',
  FPAdultOrYouthLabel: 'label[for="fm_create_account_fixed_penalty_defendant_type-adultOrYouthOnly"]',
  FPCompany: 'input[name="fm_create_account_fixed_penalty_defendant_type"][value="company"]',
  FPCompanyLabel: 'label[for="fm_create_account_fixed_penalty_defendant_type-company"]',
  ConditionalCautionHint: 'div[id="fm_create_account_account_type-ConditionalCaution-item-hint"]',
  continueButton: 'button[id="submitForm"]',
  cancelLink: 'a.govuk-link.button-link',
} as const;
