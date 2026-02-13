/**
 * @file mac.parent-guardian-details.locators.ts
 * @description
 * Selector map for the Manual Account Creation **Parent or guardian details** task.
 *
 * @remarks
 * - Uses explicit form control IDs defined in the Angular template.
 * - Alias fields are exposed via helper functions keyed by zero-based index.
 * - CTA selectors prefer semantic classes/IDs; text matching is handled in actions.
 */
export const MacParentGuardianDetailsLocators = {
  app: 'app-fines-mac-parent-guardian-details-form',
  pageHeader: 'h1.govuk-heading-l',
  pageTitle: 'h1.govuk-heading-l',
  formRoot: 'form',
  legend: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
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
  cancelLink: 'a.govuk-link.button-link',
  aliasAdd: '#fm_parent_guardian_details_add_alias',
  aliasAddButton: 'button[id="addAlias"]',
  aliasRemoveButton: '.govuk-link--no-visited-state',
  aliasContainer: 'div[id="fm_parent_guardian_details_alias_container"]',
  returnToAccountDetailsButton: 'button:contains("Return to account details")',
  addContactDetailsButton: 'button:contains("Add contact details")',
  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  fields: {
    firstNames: '#fm_parent_guardian_details_forenames',
    lastName: '#fm_parent_guardian_details_surname',
    addAliases: '#fm_parent_guardian_details_add_alias',
    dob: '#fm_parent_guardian_details_dob',
    nationalInsuranceNumber: '#fm_parent_guardian_details_national_insurance_number',
    addressLine1: '#fm_parent_guardian_details_address_line_1',
    addressLine2: '#fm_parent_guardian_details_address_line_2',
    addressLine3: '#fm_parent_guardian_details_address_line_3',
    postcode: '#fm_parent_guardian_details_post_code',
    vehicleMake: '#fm_parent_guardian_details_vehicle_make',
    vehicleRegistration: '#fm_parent_guardian_details_vehicle_registration_mark',
    aliases: {
      /**
       * Resolves Alias → First names input by zero-based index.
       * @param index Alias row index (zero-based).
       * @returns Selector for the alias first names input.
       */
      firstNames: (index: number): string => `#fm_parent_guardian_details_alias_forenames_${index}`,
      /**
       * Resolves Alias → Last name input by zero-based index.
       * @param index Alias row index (zero-based).
       * @returns Selector for the alias last name input.
       */
      lastName: (index: number): string => `#fm_parent_guardian_details_alias_surname_${index}`,
      /**
       * Remove link for a specific alias row (aria-label follows "Remove alias N").
       * @param index Alias row index (zero-based).
       * @returns Selector for the remove link of the alias row.
       */
      removeLink: (index: number): string => `[aria-label="Remove alias ${index + 1}"]`,
    },
  },
  actions: {
    addAnotherAliasButton: '#addAlias',
    returnToAccountDetailsButton: 'button#submitForm:not(.nested-flow)',
    addContactDetailsButton: 'button#submitForm.nested-flow',
    cancelLink: 'a.govuk-link.button-link',
  },
  errors: {
    inline: '.govuk-error-message, .govuk-form-group--error .govuk-error-message',
  },
} as const;

export const getAliasFirstName = (index: number): string =>
  MacParentGuardianDetailsLocators.fields.aliases.firstNames(index);

export const getAliasLastName = (index: number): string =>
  MacParentGuardianDetailsLocators.fields.aliases.lastName(index);
