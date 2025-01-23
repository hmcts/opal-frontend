export const DOM_ELEMENTS: { [key: string]: string } = {
  dob: 'input[id="fm_parent_guardian_details_dob"]',
  firstName: 'input[id="fm_parent_guardian_details_forenames"]',
  lastName: 'input[id="fm_parent_guardian_details_surname"]',
  addressLine1: 'input[id="fm_parent_guardian_details_address_line_1"]',
  addressLine2: 'input[id="fm_parent_guardian_details_address_line_2"]',
  addressLine3: 'input[id="fm_parent_guardian_details_address_line_3"]',
  postcode: 'input[id="fm_parent_guardian_details_post_code"]',
  vehicle_make: 'input[id="fm_parent_guardian_details_vehicle_make"]',
  vehicle_registration_mark: 'input[id="fm_parent_guardian_details_vehicle_registration_mark"]',
  niNumber: 'input[id="fm_parent_guardian_details_national_insurance_number"]',
  aliasDob: 'input[id="fm_parent_guardian_details_alias_dob"]',
  aliasNiNumber: 'input[id="fm_parent_guardian_details_alias_national_insurance_number"]',
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
