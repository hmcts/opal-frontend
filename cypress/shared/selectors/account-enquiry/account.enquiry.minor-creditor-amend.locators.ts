/**
 * @file account.enquiry.minor-creditor-amend.locators.ts
 * @description
 * Selector map for the Account Enquiry amend minor creditor details screen.
 */
export const MINOR_CREDITOR_AMEND_ELEMENTS = {
  form: 'app-fines-acc-minor-creditor-add-amend-convert-form form',
  pageHeading: 'app-fines-acc-minor-creditor-add-amend-convert-form h1.govuk-heading-l',
  headingCaption: 'app-fines-acc-minor-creditor-add-amend-convert-form .govuk-caption-l',
  errorSummary: '.govuk-error-summary',

  individualRadio:
    '[inputid="facc_minor_creditor_creditor_type_individual"] > [name="facc_minor_creditor_creditor_type"]',
  individualLabel: 'label[for="facc_minor_creditor_creditor_type_individual"]',
  companyRadio: '[inputid="facc_minor_creditor_creditor_type_company"] > [name="facc_minor_creditor_creditor_type"]',
  companyLabel: 'label[for="facc_minor_creditor_creditor_type_company"]',

  titleLabel: 'label[for="facc_minor_creditor_title"]',
  titleSelect: 'select#facc_minor_creditor_title',
  forenamesLabel: 'label[for="facc_minor_creditor_forenames"]',
  forenamesInput: 'input#facc_minor_creditor_forenames',
  surnameLabel: 'label[for="facc_minor_creditor_surname"]',
  surnameInput: 'input#facc_minor_creditor_surname',
  companyNameLabel: 'label[for="facc_minor_creditor_company_name"]',
  companyNameInput: 'input#facc_minor_creditor_company_name',

  addressLine1Label: 'label[for="facc_minor_creditor_address_line_1"]',
  addressLine1Input: 'input#facc_minor_creditor_address_line_1',
  addressLine2Label: 'label[for="facc_minor_creditor_address_line_2"]',
  addressLine2Input: 'input#facc_minor_creditor_address_line_2',
  addressLine3Label: 'label[for="facc_minor_creditor_address_line_3"]',
  addressLine3Input: 'input#facc_minor_creditor_address_line_3',
  postcodeLabel: 'label[for="facc_minor_creditor_post_code"]',
  postcodeInput: 'input#facc_minor_creditor_post_code',

  payByBacsCheckbox: 'input#facc_minor_creditor_pay_by_bacs',
  payByBacsLabel: 'label[for="facc_minor_creditor_pay_by_bacs"]',
  bankAccountNameLabel: 'label[for="facc_minor_creditor_bank_account_name"]',
  bankAccountNameInput: 'input#facc_minor_creditor_bank_account_name',
  bankSortCodeLabel: 'label[for="facc_minor_creditor_bank_sort_code"]',
  bankSortCodeInput: 'input#facc_minor_creditor_bank_sort_code',
  bankAccountNumberLabel: 'label[for="facc_minor_creditor_bank_account_number"]',
  bankAccountNumberInput: 'input#facc_minor_creditor_bank_account_number',
  bankAccountReferenceLabel: 'label[for="facc_minor_creditor_bank_account_reference"]',
  bankAccountReferenceInput: 'input#facc_minor_creditor_bank_account_reference',

  submitButton: 'button#submitForm',
  cancelLink: 'app-fines-acc-minor-creditor-add-amend-convert-form a.govuk-link',
} as const;
