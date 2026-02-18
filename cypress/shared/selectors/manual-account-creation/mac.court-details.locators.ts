/**
 * @file mac.court-details.locators.ts
 * @description Selector map for the Manual Account Creation **Court details** task.
 *
 * @remarks
 * - Provides IDs for LJA/PCR/enforcement court autocomplete fields and navigation CTAs.
 * - Intended for Cypress actions/flows; keeps selectors out of specs.
 */
export const MacCourtDetailsLocators = {
  componentRoot: 'app-fines-mac-court-details-form',
  pageHeader: 'h1.govuk-heading-l',
  ljaLabel: 'label[for="fm_court_details_originator_id-autocomplete"]',
  ljaHint: '#fm_court_details_originator_id-hint',
  ljaInput: 'input[id="fm_court_details_originator_id-autocomplete"]',
  ljaListbox: 'ul[id="fm_court_details_originator_id-autocomplete__listbox"]',
  ljaErrorMessage: '#fm_court_details_originator_id-autocomplete-error-message',
  pcrLabel: 'label[for="fm_court_details_prosecutor_case_reference"]',
  pcrHint: '#fm_court_details_prosecutor_case_reference-hint',
  pcrInput: 'input[id="fm_court_details_prosecutor_case_reference"]',
  pcrErrorMessage: '#fm_court_details_prosecutor_case_reference-error-message',
  enforcementCourtLabel: 'label[for="fm_court_details_imposing_court_id-autocomplete"]',
  enforcementCourtHint: '#fm_court_details_imposing_court_id-hint',
  enforcementCourtInput: 'input[id="fm_court_details_imposing_court_id-autocomplete"]',
  enforcementCourtListbox: 'ul[id="fm_court_details_imposing_court_id-autocomplete__listbox"]',
  enforcementCourtErrorMessage: '#fm_court_details_imposing_court_id-autocomplete-error-message',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
  nestedFlowButton: 'button.nested-flow',
  cancelLink: 'a.govuk-link.button-link',
  errorSummary: '.govuk-error-summary',
} as const;
