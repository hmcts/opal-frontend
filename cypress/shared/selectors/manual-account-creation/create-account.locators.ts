export const ManualCreateAccountLocators = {
  pageHeader: 'h1.govuk-heading-l',
  businessUnit: {
    input: 'input[id="fm_create_account_business_unit_id-autocomplete"]',
    listbox: 'ul[id="fm_create_account_business_unit_id-autocomplete__listbox"]',
  },
  accountType: {
    fine: 'input[id="Fine"]',
    fixedPenalty: 'input[id="FixedPenalty"]',
    conditionalCaution: 'input[id="ConditionalCaution"]',
  },
  defendantType: {
    adultOrYouth: 'input[id="adultOrYouthOnly"]',
    parentOrGuardianToPay: 'input[id="pgToPay"]',
    company: 'input[id="company"]',
  },
  continueButton: 'button[id="submitForm"]',
  cancelLink: 'a.govuk-link.button-link',
} as const;
