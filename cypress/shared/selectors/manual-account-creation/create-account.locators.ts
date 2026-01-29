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
    input:
      'input[id="fm_create_account_business_unit_id-autocomplete"], input[name="fm_create_account_business_unit_id"], input[id="fm_create_account_business_unit_id"]',
    listbox: 'ul[id="fm_create_account_business_unit_id-autocomplete__listbox"], ul[role="listbox"]',
  },
  accountType: {
    fine: 'input[name="fm_create_account_account_type"][value="Fine"], input[id="fm_create_account_account_type-Fine"]',
    fixedPenalty:
      'input[name="fm_create_account_account_type"][value="Fixed Penalty"], input[id="fm_create_account_account_type-FixedPenalty"]',
    conditionalCaution:
      'input[name="fm_create_account_account_type"][value="Conditional Caution"], input[id="fm_create_account_account_type-ConditionalCaution"]',
  },
  defendantType: {
    adultOrYouth: 'input[name$="_defendant_type"][value="adultOrYouthOnly"], input[id$="-adultOrYouthOnly"]',
    parentOrGuardianToPay: 'input[name$="_defendant_type"][value="pgToPay"], input[id$="-pgToPay"]',
    company: 'input[name$="_defendant_type"][value="company"], input[id$="-company"]',
  },
  defendantTypePanel: {
    fine: '#fm_create_account_fine_defendant_type_conditional',
    fixedPenalty: '#fm_create_account_fixed_penalty_defendant_type_conditional',
  },
  continueButton: 'button[id="submitForm"]',
  cancelLink: 'a.govuk-link.button-link',
} as const;
