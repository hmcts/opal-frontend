export const ManualCourtDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  ljaInput: 'input[id="fm_court_details_originator_id-autocomplete"]',
  ljaListbox: 'ul[id="fm_court_details_originator_id-autocomplete__listbox"]',
  pcrInput: 'input[id="fm_court_details_prosecutor_case_reference"]',
  enforcementCourtInput: 'input[id="fm_court_details_imposing_court_id-autocomplete"]',
  enforcementCourtListbox: 'ul[id="fm_court_details_imposing_court_id-autocomplete__listbox"]',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
} as const;
