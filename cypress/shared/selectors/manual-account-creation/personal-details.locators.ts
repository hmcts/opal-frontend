/**
 * @file personal-details.locators.ts
 * @description Selector map for the Manual Account Creation **Personal details** task.
 *
 * @remarks
 * - Includes title dropdown, name/address inputs, and navigation CTA.
 * - For Cypress actions/flows; keep selectors out of specs.
 */
export const ManualPersonalDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  titleSelect: 'select[id="fm_personal_details_title"]',
  firstNamesInput: 'input[id="fm_personal_details_forenames"]',
  lastNameInput: 'input[id="fm_personal_details_surname"]',
  addressLine1Input: 'input[id="fm_personal_details_address_line_1"]',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
} as const;
