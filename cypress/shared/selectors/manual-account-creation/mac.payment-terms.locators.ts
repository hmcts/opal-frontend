/**
 * @file mac.payment-terms.locators.ts
 * @description Selector map for the Manual Account Creation **Payment terms** task.
 *
 * @remarks
 * - Captures collection order radios/date, pay-in-full toggle, pay-by date, and navigation CTA.
 * - Centralized for Cypress actions/flows.
 */
const date = new Date();
const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

export const MacPaymentTermsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  pageTitle: 'h1.govuk-heading-l',
  legend: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--s',
  finesMacPaymentTermsForm: 'app-fines-mac-payment-terms-form',

  payInFullLabel: 'label[for="fm_payment_terms_payment_terms-payInFull"]',
  payByDateLabel: 'label[for="fm_payment_terms_pay_by_date"]',
  instalmentsOnlyLabel: 'label[for="fm_payment_terms_payment_terms-instalmentsOnly"]',
  instalmentAmountLabel: 'label[for="fm_payment_terms_instalment_amount"]',
  instalmentsOnlyFrequencyWeeklyLabel: 'label[for="instalmentsOnly-W"]',
  instalmentsOnlyFrequencyFortnightlyLabel: 'label[for="instalmentsOnly-F"]',
  instalmentsOnlyFrequencyMonthlyLabel: 'label[for="instalmentsOnly-M"]',
  lumpSumFrequencyWeeklyLabel: 'label[for="lumpSumPlusInstalments-W"]',
  lumpSumFrequencyFortnightlyLabel: 'label[for="lumpSumPlusInstalments-F"]',
  lumpSumFrequencyMonthlyLabel: 'label[for="lumpSumPlusInstalments-M"]',
  startDateLabel: 'label[for="fm_payment_terms_start_date"]',
  lumpSumPlusInstalmentsLabel: 'label[for="fm_payment_terms_payment_terms-lumpSumPlusInstalments"]',
  lumpSumAmountLabel: 'label[for="fm_payment_terms_lump_sum_amount"]',
  hasDaysInDefaultLabel: 'label[for="fm_payment_terms_has_days_in_default"]',
  suspendedCommittalDateLabel: 'label[for="fm_payment_terms_suspended_committal_date"]',
  defaultDaysInJailLabel: 'label[for="fm_payment_terms_default_days_in_jail"]',
  daysInDefaultCalculator: 'span.govuk-details__summary-text',
  addEnforcementActionLabel: 'label[for="fm_payment_terms_add_enforcement_action"]',
  prisLabel: 'label[for="fm_payment_terms_enforcement_action-PRIS"]',
  earliestReleaseDateLabel: 'label[for="fm_payment_terms_earliest_release_date"]',
  prisonAndPrisonNumberLabel: 'label[for="fm_payment_terms_prison_and_prison_number"]',
  noenfLabel: 'label[for="fm_payment_terms_enforcement_action-NOENF"]',
  reasonAccountIsOnNoenfLabel: 'label[for="fm_payment_terms_reason_account_is_on_noenf"]',
  paymentCardLabel: 'label[for="fm_payment_terms_payment_card_request"]',

  prisHint: 'div[id = "fm_payment_terms_prison_and_prison_number-hint"]',
  prisCharHint: 'div.govuk-character-count__message.govuk-character-count__status',
  noenfCharHint: 'div.govuk-character-count__message.govuk-character-count__status',
  dateHint: 'div.govuk-hint',

  collectionOrder: {
    yes: 'input[name="fm_payment_terms_collection_order_made"][value="true"]',
    no: 'input[name="fm_payment_terms_collection_order_made"][value="false"]',
    date: 'input[id="fm_payment_terms_collection_order_date"]',
    today: '#fm_payment_terms_collection_order_made_today',
  },
  collectionOrderMadeTrue: 'input[name="fm_payment_terms_collection_order_made"][value="true"]',
  collectionOrderDate: 'input[id="fm_payment_terms_collection_order_date"]',
  collectionOrderDateLabel: 'label[for="fm_payment_terms_collection_order_date"]',
  collectionOrderHint: 'div.govuk-hint',
  collectionYes: 'input[name="fm_payment_terms_collection_order_made"][value="true"]',
  collectionNo: 'input[name="fm_payment_terms_collection_order_made"][value="false"]',
  collectionYesLabel: 'label[for="fm_payment_terms_collection_order_made-fm_payment_terms_collection_order_made_true"]',
  collectionNoLabel: 'label[for="fm_payment_terms_collection_order_made-fm_payment_terms_collection_order_made_false"]',
  makeCollection: 'input[id = "fm_payment_terms_collection_order_made_today"]',
  makeCollectionLabel: 'label[for="fm_payment_terms_collection_order_made_today"]',

  datePickerButton: 'button.moj-datepicker__toggle.moj-js-datepicker-toggle',
  datePickerPayByDateElement: 'div[id = "datepicker-fm_payment_terms_pay_by_date"]',
  datePickerStartDateElement: 'div[id = "datepicker-fm_payment_terms_start_date"]',
  datePickerSubmitButton: 'button.govuk-button.moj-js-datepicker-ok',
  datePickerCancelButton: 'button.govuk-button.govuk-button--secondary.moj-js-datepicker-cancel',
  datePickerDialogHead: 'div.moj-datepicker__dialog-header',
  testDate: `button[data-testid="${formattedDate}"]`,

  payInFull: 'input[name="fm_payment_terms_payment_terms"][value="payInFull"]',
  paymentTerms: {
    payInFull: 'input[name="fm_payment_terms_payment_terms"][value="payInFull"]',
    instalmentsOnly: 'input[name="fm_payment_terms_payment_terms"][value="instalmentsOnly"]',
    lumpSumPlusInstalments: 'input[name="fm_payment_terms_payment_terms"][value="lumpSumPlusInstalments"]',
  },
  payByDate: 'input[id="fm_payment_terms_pay_by_date"]',
  paymentCard: 'input[id = "fm_payment_terms_payment_card_request"]',
  instalmentsOnly: 'input[name="fm_payment_terms_payment_terms"][value="instalmentsOnly"]',
  instalmentAmount:
    '.govuk-radios__conditional:not(.govuk-radios__conditional--hidden) #fm_payment_terms_instalment_amount',
  startDate: '#fm_payment_terms_start_date',
  lumpSumPlusInstalments: 'input[name="fm_payment_terms_payment_terms"][value="lumpSumPlusInstalments"]',
  lumpSumAmount: '#fm_payment_terms_lump_sum_amount',

  instalmentsOnlyFrequency: {
    weekly: 'input[name="instalmentsOnly"][value="W"]',
    fortnightly: 'input[name="instalmentsOnly"][value="F"]',
    monthly: 'input[name="instalmentsOnly"][value="M"]',
  },
  instalmentsOnlyFrequencyWeekly: 'input[name="instalmentsOnly"][value="W"]',
  instalmentsOnlyFrequencyMonthly: 'input[name="instalmentsOnly"][value="M"]',
  instalmentsOnlyFrequencyFortnightly: 'input[name="instalmentsOnly"][value="F"]',
  lumpSumFrequency: {
    weekly: 'input[name="lumpSumPlusInstalments"][value="W"]',
    fortnightly: 'input[name="lumpSumPlusInstalments"][value="F"]',
    monthly: 'input[name="lumpSumPlusInstalments"][value="M"]',
  },
  lumpSumFrequencyWeekly: 'input[name="lumpSumPlusInstalments"][value="W"]',
  lumpSumFrequencyMonthly: 'input[name="lumpSumPlusInstalments"][value="M"]',
  lumpSumFrequencyFortnightly: 'input[name="lumpSumPlusInstalments"][value="F"]',

  submitButton: 'button[type="submit"]',
  mojTicketPanel: '.moj-ticket-panel',
  govukErrorMessage: '.govuk-error-message',

  requestPaymentCard: '#fm_payment_terms_payment_card_request',
  daysInDefault: {
    checkbox: '#fm_payment_terms_has_days_in_default',
    date: '#fm_payment_terms_suspended_committal_date',
    days: '#fm_payment_terms_default_days_in_jail',
  },
  hasDaysInDefault: 'input[id="fm_payment_terms_has_days_in_default"]',
  suspendedCommittalDate: 'input[id="fm_payment_terms_suspended_committal_date"]',
  defaultDaysInJail: 'input[id="fm_payment_terms_default_days_in_jail"]',

  enforcement: {
    add: '#fm_payment_terms_add_enforcement_action, #fm_payment_terms_hold_enforcement_on_account',
    options: {
      prison: 'input[name="fm_payment_terms_enforcement_action"][value="PRIS"]',
      holdOnAccount:
        'input[id="fm_payment_terms_hold_enforcement_on_account"], input[name="fm_payment_terms_enforcement_action"][value="NOENF"]',
    },
    earliestReleaseDate: '#fm_payment_terms_earliest_release_date',
    prisonAndNumber: '#fm_payment_terms_prison_and_prison_number',
    noenfReason: '#fm_payment_terms_reason_account_is_on_noenf',
  },
  addEnforcementAction: 'input[id="fm_payment_terms_add_enforcement_action"]',
  pris: 'input[name="fm_payment_terms_enforcement_action"][value="PRIS"]',
  earliestReleaseDate: 'input[id="fm_payment_terms_earliest_release_date"]',
  prisonAndPrisonNumber: 'textarea[id="fm_payment_terms_prison_and_prison_number"]',
  noenf: 'input[name="fm_payment_terms_enforcement_action"][value="NOENF"]',
  reasonAccountIsOnNoenf: 'textarea[id="fm_payment_terms_reason_account_is_on_noenf"]',

  panel: 'opal-lib-moj-ticket-panel',
  years: 'input[id="years"]',
  months: 'input[id="months"]',
  days: 'input[id="days"]',
  weeks: 'input[id="weeks"]',
  calculatedDays: 'div.govuk-grid-column-one-half',
  calculateLink: 'span.govuk-details__summary-text',
  calculateHeading: 'h1.govuk-fieldset__heading',
  yearsLabel: 'label[for="years"]',
  monthsLabel: 'label[for="months"]',
  daysLabel: 'label[for="days"]',
  weeksLabel: 'label[for="weeks"]',

  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
  addAccountCommentsButton: 'button[type="submit"]:contains("Add account comments and notes")',
  cancelLink: 'a.govuk-link:contains("Cancel")',
} as const;
