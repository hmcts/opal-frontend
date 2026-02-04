/**
 * @file account.paymen-terms.details.locators.ts
 * @description
 * Selector map for the **Payment terms tab** within the Account Details view.
 *
 * @remarks
 * - Uses stable IDs from summary list rows to assert values.
 * - Scope selectors to the payment terms tab to avoid collisions with other tabs.
 */
export const AccountPaymentTermsDetailsLocators = {
  /** Root element for the Payment terms tab content. */
  tabRoot: 'app-fines-acc-defendant-details-payment-terms-tab',

  /** Change link within the Payment terms tab header. */
  changeLink: 'app-fines-acc-defendant-details-payment-terms-tab a.govuk-link',

  /** Summary list value fields for payment terms data. */
  fields: {
    payByDate: '#payment-termsEffective-dateValue',
    startDate: '#payment-termsEffective-dateValue',
    instalmentAmount: '#payment-termsInstalment-amountValue',
    instalmentFrequency: '#payment-termsInstalment-periodValue',
    lumpSumAmount: '#payment-termsLump-sum-amountValue',
    daysInDefault: '#payment-termsDays-in-defaultValue',
    dateDaysInDefaultImposed: '#payment-termsDate-days-in-default-were-imposedValue',
    paymentCardLastRequested: '#payment-termsPayment-card-last-requestedValue',
    dateLastAmended: '#payment-terms-amendmentsDate-last-amendedValue',
    lastAmendedBy: '#payment-terms-amendmentsLast-amended-byValue',
    amendmentReason: '#payment-terms-amendmentsAmendement-reasonValue',
    
  // ──────────────────────────────
  // Payment terms tab (Account Details)
  // ──────────────────────────────
  tab: {
    /** Root element for the Payment terms tab content. */
    root: 'app-fines-acc-defendant-details-payment-terms-tab',

    /** "Payment card last requested" summary value cell. */
    paymentCardLastRequestedValue: '#payment-termsPayment-card-last-requestedValue',

    /** "Payment card last requested" summary actions cell. */
    paymentCardLastRequestedActions: '#payment-termsPayment-card-last-requestedActions',

    /** Action link to request a payment card. */
    requestPaymentCardLink: '#payment-termsPayment-card-last-requestedActions a.govuk-link',
  },

  // ──────────────────────────────
  // Request payment card confirmation page
  // ──────────────────────────────
  confirmation: {
    /** Root scope for confirmation page content. */
    root: 'main[role="main"]',

    /** Page header for the confirmation page. */
    header: 'main[role="main"] h1.govuk-heading-l',

    /** Confirm button to submit the request. */
    confirmButton: 'main[role="main"] button.govuk-button:contains("Yes - request a payment card")',

    /** Cancel link to return to account details. */
    cancelLink: 'main[role="main"] a.govuk-link:contains("No - cancel")',
  },

  // ──────────────────────────────
  // Banners
  // ──────────────────────────────
  banners: {
    /** Success banner container on account details page. */
    success: 'opal-lib-moj-alert[type="success"]',

    /** Success banner text content. */
    successText: 'opal-lib-moj-alert-content-text',
  },
} as const;
