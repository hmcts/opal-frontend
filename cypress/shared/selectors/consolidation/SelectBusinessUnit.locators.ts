export const SelectBusinessUnitLocators = {
  heading: 'h1.govuk-heading-l',
  app: 'div.govuk-grid-column-two-thirds',
  errorSummary: '.govuk-error-summary',
  // Business unit
  businessUnitHint: '#fcon_select_bu_business_unit_id-hint',
  businessUnitInput: 'input[id = "fcon_select_bu_business_unit_id-autocomplete"]',
  businessUnitLabel:
    'label[for = "fcon_select_bu_business_unit_id-autocomplete"], label[for="fcon_select_bu_business_unit_id"]',
  businessUnitAutoComplete: 'ul[id = "fcon_select_bu_business_unit_id-autocomplete__listbox"]',
  businessUnitErrorMessage: '#fcon_select_bu_business_unit_id-autocomplete-error-message',
  singleBusinessUnitMessage: 'p.govuk-body',
  // defendant type
  defendantTypeHeading: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
  individualInput: 'input[name="fcon_select_bu_defendant_type"][value="individual"]',
  individualLabel: 'label[for = "fcon_select_bu_defendant_type-individual"]',
  companyInput: 'input[name="fcon_select_bu_defendant_type"][value="company"]',
  companyLabel: 'label[for = "fcon_select_bu_defendant_type-company"]',

  continueButton: 'button[id = "submitForm"]',
  cancelLink: 'a.govuk-link.button-link',
};
