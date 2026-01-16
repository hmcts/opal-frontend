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
  },
} as const;
