export const ManualCompanyDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  companyNameInput: 'input[id="fm_company_details_company_name"]',
  addAliasesCheckbox: 'input[id="fm_company_details_add_alias"]',
  addAliasButton: 'button[id="addAlias"]',
  aliasFieldset: '#fm_company_details_add_alias-conditional',
  aliasInput: (index: number) => `input[id="fm_company_details_alias_company_name_${index}"]`,
  aliasLabel: (index: number) =>
    `#fm_company_details_add_alias-conditional :nth-child(${index}) legend.govuk-fieldset__legend`,
  aliasRemoveLink: '.govuk-link:contains("Remove")',
  inlineError: '.govuk-error-message, .govuk-form-group--error .govuk-error-message',
  addressLine1Input: 'input[id="fm_company_details_address_line_1"]',
  addressLine2Input: 'input[id="fm_company_details_address_line_2"]',
  addressLine3Input: 'input[id="fm_company_details_address_line_3"]',
  postcodeInput: 'input[id="fm_company_details_postcode"]',
  addContactDetailsButton: 'button:contains("Add contact details")',
  cancelLink: 'a.govuk-link.button-link',
} as const;
