/**
 * @file parent-guardian-details.locators.ts
 * @description
 * Selector map for the Manual Account Creation **Parent or guardian details** task.
 *
 * @remarks
 * - Uses explicit form control IDs defined in the Angular template.
 * - Alias fields are exposed via helper functions keyed by zero-based index.
 * - CTA selectors prefer semantic classes/IDs; text matching is handled in actions.
 */
export const ManualParentGuardianDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  formRoot: 'form',
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
      /** Resolves Alias → First names input by zero-based index. */
      firstNames: (index: number): string => `#fm_parent_guardian_details_alias_forenames_${index}`,
      /** Resolves Alias → Last name input by zero-based index. */
      lastName: (index: number): string => `#fm_parent_guardian_details_alias_surname_${index}`,
      /** Remove link for a specific alias row (aria-label follows "Remove alias N"). */
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
