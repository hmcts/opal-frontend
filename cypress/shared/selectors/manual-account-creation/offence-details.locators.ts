/**
 * @file offence-details.locators.ts
 * @description Selector map for the Manual Account Creation **Offence details** task.
 *
 * @remarks
 * - Includes offence/imposition inputs, autocomplete listboxes, and navigation CTAs.
 * - Keep selectors centralized for Cypress actions/flows.
 */
export const ManualOffenceDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  dateOfSentenceInput: 'input[id = "fm_offence_details_date_of_sentence"]',
  offenceCodeInput: 'input[id = "fm_offence_details_offence_cjs_code"]',
  reviewOffenceButton: 'button[type="submit"]:contains("Review offence")',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
  imposition: {
    resultCodeInput: (index: number) => `input[id = "fm_offence_details_result_id_${index}-autocomplete"]`,
    resultCodeList: (index: number) => `ul[id = "fm_offence_details_result_id_${index}-autocomplete__listbox"]`,
    amountImposedInput: (index: number) => `input[id = "fm_offence_details_amount_imposed_${index}"]`,
    amountPaidInput: (index: number) => `input[id = "fm_offence_details_amount_paid_${index}"]`,
  },
} as const;
