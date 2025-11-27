/**
 * @file court-details.locators.ts
 * @description Selector map for the Manual Account Creation **Court details** task.
 *
 * @remarks
 * - Provides IDs for LJA/PCR/enforcement court autocomplete fields and navigation CTAs.
 * - Intended for Cypress actions/flows; keeps selectors out of specs.
 */
export const ManualCourtDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  ljaInput: 'input[id="fm_court_details_originator_id-autocomplete"]',
  ljaListbox: 'ul[id="fm_court_details_originator_id-autocomplete__listbox"]',
  pcrInput: 'input[id="fm_court_details_prosecutor_case_reference"]',
  enforcementCourtInput: 'input[id="fm_court_details_imposing_court_id-autocomplete"]',
  enforcementCourtListbox: 'ul[id="fm_court_details_imposing_court_id-autocomplete__listbox"]',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
} as const;
