export const DOM_ELEMENTS = {
  pageHeading: 'h1.govuk-heading-l',
  errorSummary: 'opal-lib-govuk-error-summary',
  form: 'app-fines-mac-offence-details-minor-creditor-form',
  legendS: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--s',
  legendM: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
  // Creditor Type Radios
  creditorTypeIndividual: 'input[id="individual"]',
  creditorTypeCompany: 'input[id="company"]',

  // Individual-Specific Fields
  titleSelect: 'select[id="fm_offence_details_minor_creditor_title"]',
  forenamesInput: 'input[id="fm_offence_details_minor_creditor_forenames"]',
  surnameInput: 'input[id="fm_offence_details_minor_creditor_surname"]',

  // Company-Specific Field
  companyNameInput: 'input[id="fm_offence_details_minor_creditor_company_name"]',

  // Address Fields
  addressLine1Input: 'input[id="fm_offence_details_minor_creditor_address_line_1"]',
  addressLine2Input: 'input[id="fm_offence_details_minor_creditor_address_line_2"]',
  addressLine3Input: 'input[id="fm_offence_details_minor_creditor_address_line_3"]',
  postCodeInput: 'input[id="fm_offence_details_minor_creditor_post_code"]',

  // BACS Payment Checkbox
  payByBacsCheckbox: 'input[id="fm_offence_details_minor_creditor_pay_by_bacs"]',

  // BACS Payment Fields (shown conditionally if payByBacsCheckbox is checked)
  bankAccountNameInput: 'input[id="fm_offence_details_minor_creditor_bank_account_name"]',
  bankSortCodeInput: 'input[id="fm_offence_details_minor_creditor_bank_sort_code"]',
  bankAccountNumberInput: 'input[id="fm_offence_details_minor_creditor_bank_account_number"]',
  bankPaymentRefInput: 'input[id="fm_offence_details_minor_creditor_bank_account_ref"]',

  //labels
  titleLabel: 'label[for="fm_offence_details_minor_creditor_title"]',
  forenamesLabel: 'label[for="fm_offence_details_minor_creditor_forenames"]',
  surnameLabel: 'label[for="fm_offence_details_minor_creditor_surname"]',
  companyNameLabel: 'label[for="fm_offence_details_minor_creditor_company_name"]',
  addressLine1Label: 'label[for="fm_offence_details_minor_creditor_address_line_1"]',
  addressLine2Label: 'label[for="fm_offence_details_minor_creditor_address_line_2"]',
  addressLine3Label: 'label[for="fm_offence_details_minor_creditor_address_line_3"]',
  postCodeLabel: 'label[for="fm_offence_details_minor_creditor_post_code"]',
  payByBacsLabel: 'label[for="fm_offence_details_minor_creditor_pay_by_bacs"]',
  bankAccountNameLabel: 'label[for="fm_offence_details_minor_creditor_bank_account_name"]',
  bankSortCodeLabel: 'label[for="fm_offence_details_minor_creditor_bank_sort_code"]',
  bankAccountNumberLabel: 'label[for="fm_offence_details_minor_creditor_bank_account_number"]',
  bankPaymentRefLabel: 'label[for="fm_offence_details_minor_creditor_bank_account_ref"]',

  // Buttons
  submitButton: 'button[id="submitForm"]',

  //links
  cancelLink: 'opal-lib-govuk-cancel-link',
};
