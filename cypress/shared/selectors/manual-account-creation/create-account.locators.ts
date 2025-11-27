/**
 * @file create-account.locators.ts
 * @description Selector map for the Manual Account Creation **Business unit and defendant type** start page.
 *
 * @remarks
 * - Covers business unit autocomplete, account type/defendant type radios, and navigation CTAs.
 * - Used by Cypress actions/flows to keep feature steps selector-free.
 */
export const ManualCreateAccountLocators = {
  pageHeader: 'h1.govuk-heading-l',
  businessUnit: {
    // The accessible autocomplete renders a text input with the provided id/name; older renders append "-autocomplete".
    input: 'input[id="fm_create_account_business_unit_id-autocomplete"], input[name="fm_create_account_business_unit_id"], input[id="fm_create_account_business_unit_id"]',
    listbox: 'ul[id="fm_create_account_business_unit_id-autocomplete__listbox"], ul[role="listbox"]',
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
