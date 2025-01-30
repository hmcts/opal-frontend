export const DOM_ELEMENTS = {
  app: 'app-fines-mac-parent-guardian-details-form',
  pageTitle: 'h1.govuk-heading-l',

  firstNameInput: 'input[id="fm_parent_guardian_details_forenames"]',
  lastNameInput: 'input[id="fm_parent_guardian_details_surname"]',
  dobInput: 'input[id="fm_parent_guardian_details_dob"]',
  addressLine1Input: 'input[id="fm_parent_guardian_details_address_line_1"]',
  addressLine2Input: 'input[id="fm_parent_guardian_details_address_line_2"]',
  addressLine3Input: 'input[id="fm_parent_guardian_details_address_line_3"]',
  postcodeInput: 'input[id="fm_parent_guardian_details_post_code"]',
  vehicle_makeInput: 'input[id="fm_parent_guardian_details_vehicle_make"]',
  vehicle_registration_markInput: 'input[id="fm_parent_guardian_details_vehicle_registration_mark"]',
  niNumberInput: 'input[id="fm_parent_guardian_details_national_insurance_number"]',
  
  firstNameLabel: 'label[for="fm_parent_guardian_details_forenames"]',
  lastNameLabel: 'label[for="fm_parent_guardian_details_surname"]',
  dobLabel: 'label[for="fm_parent_guardian_details_dob"]',
  addressLine1Label: 'label[for="fm_parent_guardian_details_address_line_1"]',
  addressLine2Label: 'label[for="fm_parent_guardian_details_address_line_2"]',
  addressLine3Label: 'label[for="fm_parent_guardian_details_address_line_3"]',
  postcodeLabel: 'label[for="fm_parent_guardian_details_post_code"]',
  vehicleMakeLabel: 'label[for="fm_parent_guardian_details_vehicle_make"]',
  vehicleRegistrationMarkLabel: 'label[for="fm_parent_guardian_details_vehicle_registration_mark"]',
  niNumberLabel: 'label[for="fm_parent_guardian_details_national_insurance_number"]',
 
  firstNameHint: 'div[id = "fm_parent_guardian_details_forenames-hint"]',
  DateHint: 'div.govuk-hint',
  legend: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
  cancelLink: 'a.govuk-link.button-link',

  aliasAdd: '#fm_parent_guardian_details_add_alias',
  aliasAddButton: 'button[id="addAlias"]',
  aliasRemoveButton: '.govuk-link--no-visited-state',
  aliasContainer: 'div[id="fm_parent_guardian_details_alias_container"]',
  submitButton: 'button[type="submit"]',
  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
};

export const getAliasFirstName = (number: number): string => {
  return `input[id="fm_parent_guardian_details_alias_forenames_${number}"]`;
};

export const getAliasLastName = (number: number): string => {
  return `input[id="fm_parent_guardian_details_alias_surname_${number}"]`;
};
