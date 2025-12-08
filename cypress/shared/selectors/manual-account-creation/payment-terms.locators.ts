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
