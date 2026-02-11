/**
 * @file account.enquiry.payment-terms-amend.locators.ts
 * @description
 * Selector map for the **Account Enquiry – Amend payment terms** screen.
 * Includes payment term options, instalments, dates, and action controls.
 *
 * @remarks
 * - Use these selectors in Cypress tests to keep steps selector-free.
 * - Prefer ID-based selectors for stability.
 *
 * @example
 * ```ts
 * cy.get(PAYMENT_TERMS_AMEND_ELEMENTS.payInFullRadio).check();
 * cy.get(PAYMENT_TERMS_AMEND_ELEMENTS.payByDateInput).type('01/01/2030');
 * ```
 */
export const PAYMENT_TERMS_AMEND_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  pageHeading: 'h1.govuk-heading-l',
  form: 'app-fines-acc-payment-terms-amend-form form',

  paymentTermsFieldset: 'fieldset#facc_payment_terms_payment_terms',
  payInFullRadio: 'input#facc_payment_terms_payment_terms-payInFull',
  payInFullLabel: 'label[for="facc_payment_terms_payment_terms-payInFull"]',
  instalmentsOnlyRadio: 'input#facc_payment_terms_payment_terms-instalmentsOnly',
  instalmentsOnlyLabel: 'label[for="facc_payment_terms_payment_terms-instalmentsOnly"]',
  lumpSumPlusInstalmentsRadio: 'input#facc_payment_terms_payment_terms-lumpSumPlusInstalments',
  lumpSumPlusInstalmentsLabel: 'label[for="facc_payment_terms_payment_terms-lumpSumPlusInstalments"]',
  payByDateInput: 'input#facc_payment_terms_pay_by_date',
  payByDateLabel: 'label[for="facc_payment_terms_pay_by_date"]',

  lumpSumAmountInput: 'input#facc_payment_terms_lump_sum_amount',
  lumpSumAmountLabel: 'label[for="facc_payment_terms_lump_sum_amount"]',
  instalmentAmountInput: 'input#facc_payment_terms_instalment_amount',
  instalmentAmountLabel: 'label[for="facc_payment_terms_instalment_amount"]',

  frequencyWeeklyRadio: 'fieldset#facc_payment_terms_instalment_period input[id$="-W"]',
  frequencyWeeklyLabel: 'fieldset#facc_payment_terms_instalment_period label[for$="-W"]',
  frequencyFortnightlyRadio: 'fieldset#facc_payment_terms_instalment_period input[id$="-F"]',
  frequencyFortnightlyLabel: 'fieldset#facc_payment_terms_instalment_period label[for$="-F"]',
  frequencyMonthlyRadio: 'fieldset#facc_payment_terms_instalment_period input[id$="-M"]',
  frequencyMonthlyLabel: 'fieldset#facc_payment_terms_instalment_period label[for$="-M"]',

  startDateInput: 'input#facc_payment_terms_start_date',
  startDateLabel: 'label[for="facc_payment_terms_start_date"]',

  daysInDefaultCheckbox: 'input#facc_payment_terms_has_days_in_default',
  daysInDefaultLabel: 'label[for="facc_payment_terms_has_days_in_default"]',
  daysInDefaultDateInput: 'input#facc_payment_terms_suspended_committal_date',
  daysInDefaultDateLabel: 'label[for="facc_payment_terms_suspended_committal_date"]',
  daysInDefaultCountInput: 'input#facc_payment_terms_default_days_in_jail',
  daysInDefaultCountLabel: 'label[for="facc_payment_terms_default_days_in_jail"]',

  reasonForChangeTextarea: 'textarea#facc_payment_terms_reason_for_change',
  reasonForChangeLabel: 'label[for="facc_payment_terms_reason_for_change"]',
  reasonForChangeCharacterCount:
    '#facc_payment_terms_reason_for_change ~ .govuk-character-count__message.govuk-character-count__status',

  errorSummary: '.govuk-error-summary',

  paymentCardCheckbox: 'input#facc_payment_terms_payment_card_request',
  paymentCardLabel: 'label[for="facc_payment_terms_payment_card_request"]',
  changeLetterCheckbox: 'input#facc_payment_terms_change_letter',
  changeLetterLabel: 'label[for="facc_payment_terms_change_letter"]',

  submitButton: 'button#submitForm',
  cancelLink: 'opal-lib-govuk-cancel-link a',
} as const;
