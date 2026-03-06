/**
 * @file mac.company-details.locators.ts
 * @description Selector map for the Manual Account Creation **Company details** task.
 *
 * @remarks
 * - Includes alias controls, address inputs, navigation CTAs, and inline error hooks.
 * - Consumed by Cypress actions/flows; keep selectors centralized here.
 */
export const MacCompanyDetailsLocators = {
  componentRoot: 'app-fines-mac-company-details-form',
  pageHeader: 'h1.govuk-heading-l',
  addressLegend: 'fieldset legend.govuk-fieldset__legend, fieldset h2.govuk-fieldset__legend',
  companyNameLabel: 'label[for="fm_company_details_company_name"]',
  addressLine1Label: 'label[for="fm_company_details_address_line_1"]',
  addressLine2Label: 'label[for="fm_company_details_address_line_2"]',
  addressLine3Label: 'label[for="fm_company_details_address_line_3"]',
  postcodeLabel: 'label[for="fm_company_details_postcode"]',
  aliasCompanyName1Label: '#fm_company_details_add_alias-conditional :nth-child(1) legend.govuk-fieldset__legend',
  aliasCompanyName2Label: '#fm_company_details_add_alias-conditional :nth-child(2) legend.govuk-fieldset__legend',
  aliasCompanyName3Label: '#fm_company_details_add_alias-conditional :nth-child(3) legend.govuk-fieldset__legend',
  aliasCompanyName4Label: '#fm_company_details_add_alias-conditional :nth-child(4) legend.govuk-fieldset__legend',
  aliasCompanyName5Label: '#fm_company_details_add_alias-conditional :nth-child(5) legend.govuk-fieldset__legend',
  submitButton: 'button[type="submit"]',
  errorSummary: '.govuk-error-summary',
  companyNameInput: 'input[id="fm_company_details_company_name"]',
  addAliasesCheckbox: 'input[id="fm_company_details_add_alias"]',
  addAliasButton: 'button[id="addAlias"]',
  aliasCompanyName1Input: 'input[id="fm_company_details_alias_company_name_0"]',
  aliasCompanyName2Input: 'input[id="fm_company_details_alias_company_name_1"]',
  aliasCompanyName3Input: 'input[id="fm_company_details_alias_company_name_2"]',
  aliasCompanyName4Input: 'input[id="fm_company_details_alias_company_name_3"]',
  aliasCompanyName5Input: 'input[id="fm_company_details_alias_company_name_4"]',
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
