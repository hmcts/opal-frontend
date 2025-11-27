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
  },
  payInFull: 'input[id="payInFull"]',
  payByDate: 'input[id="fm_payment_terms_pay_by_date"]',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
} as const;
