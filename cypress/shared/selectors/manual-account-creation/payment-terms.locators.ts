/**
 * @file payment-terms.locators.ts
 * @description Selector map for the Manual Account Creation **Payment terms** task.
 *
 * @remarks
 * - Captures collection order radios/date, pay-in-full toggle, pay-by date, and navigation CTA.
 * - Centralized for Cypress actions/flows.
 */
export const ManualPaymentTermsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  collectionOrder: {
    yes: 'input[id="fm_payment_terms_collection_order_made_true"]',
    no: 'input[id="fm_payment_terms_collection_order_made_false"]',
    date: 'input[id="fm_payment_terms_collection_order_date"]',
    today: '#fm_payment_terms_collection_order_made_today',
  },
  payInFull: 'input[id="payInFull"]',
  paymentTerms: {
    payInFull: '#payInFull',
    instalmentsOnly: '#instalmentsOnly',
    lumpSumPlusInstalments: '#lumpSumPlusInstalments',
  },
  payByDate: 'input[id="fm_payment_terms_pay_by_date"]',
  lumpSumAmount: '#fm_payment_terms_lump_sum_amount',
  instalmentAmount: '#fm_payment_terms_instalment_amount',
  frequency: {
    weekly: '#W',
    fortnightly: '#F',
    monthly: '#M',
  },
  startDate: '#fm_payment_terms_start_date',
  requestPaymentCard: '#fm_payment_terms_payment_card_request',
  daysInDefault: {
    checkbox: '#fm_payment_terms_has_days_in_default',
    date: '#fm_payment_terms_suspended_committal_date',
    days: '#fm_payment_terms_default_days_in_jail',
  },
  enforcement: {
    add: '#fm_payment_terms_add_enforcement_action',
    options: {
      prison: '#PRIS',
      holdOnAccount: '#NOENF',
    },
    earliestReleaseDate: '#fm_payment_terms_earliest_release_date',
    prisonAndNumber: '#fm_payment_terms_prison_and_prison_number',
    noenfReason: '#fm_payment_terms_reason_account_is_on_noenf',
  },
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
  addAccountCommentsButton: 'button[type="submit"]:contains("Add account comments and notes")',
  cancelLink: 'a.govuk-link:contains("Cancel")',
} as const;
