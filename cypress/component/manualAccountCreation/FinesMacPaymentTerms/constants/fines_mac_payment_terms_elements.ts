const date = new Date();
const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

export const DOM_ELEMENTS = {
  pageTitle: 'h1.govuk-heading-l',
  legend: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--s',

  //labels
  payInFullLabel: 'label[for="payInFull"]',
  payByDateLabel: 'label[for="fm_payment_terms_pay_by_date"]',
  instalmentsOnlyLabel: 'label[for="instalmentsOnly"]',
  instalmentAmountLabel: 'label[for="fm_payment_terms_instalment_amount"]',
  frequencyWeeklyLabel: 'label[for="W"]',
  frequencyFortnightlyLabel: 'label[for="F"]',
  frequencyMonthlyLabel: 'label[for="M"]',
  startDateLabel: 'label[for="fm_payment_terms_start_date"]',
  lumpSumPlusInstalmentsLabel: 'label[for="lumpSumPlusInstalments"]',
  lumpSumAmountLabel: 'label[for="fm_payment_terms_lump_sum_amount"]',
  hasDaysInDefaultLabel: 'label[for="fm_payment_terms_has_days_in_default"]',
  suspendedCommittalDateLabel: 'label[for="fm_payment_terms_suspended_committal_date"]',
  defaultDaysInJailLabel: 'label[for="fm_payment_terms_default_days_in_jail"]',
  addEnforcementActionLabel: 'label[for="fm_payment_terms_add_enforcement_action"]',
  prisLabel: 'label[for="PRIS"]',
  earliestReleaseDateLabel: 'label[for="fm_payment_terms_earliest_release_date"]',
  prisonAndPrisonNumberLabel: 'label[for="fm_payment_terms_prison_and_prison_number"]',
  noenfLabel: 'label[for="NOENF"]',
  reasonAccountIsOnNoenfLabel: 'label[for="fm_payment_terms_reason_account_is_on_noenf"]',
  paymentCardLabel: 'label[for="fm_payment_terms_payment_card_request"]',

  //Hints
  prisHint: 'div[id = "fm_payment_terms_prison_and_prison_number-hint"]',
  prisCharHint: 'div[id="fm_payment_terms_prison_and_prison_number-hint"]',
  noenfCharHint: 'div[id="fm_payment_terms_reason_account_is_on_noenf-hint"]',
  dateHint: 'div.govuk-hint',
  // Collection order
  collectionOrderMadeTrue: 'input[id="fm_payment_terms_collection_order_made_true"]',
  collectionOrderDate: 'input[id="fm_payment_terms_collection_order_date"]',

  //Date picker
  datePickerButton: 'button.moj-datepicker__toggle.moj-js-datepicker-toggle',
  datePickerPayByDateElement: 'div[id = "datepicker-fm_payment_terms_pay_by_date"]',
  datePickerStartDateElement: 'div[id = "datepicker-fm_payment_terms_start_date"]',
  datePickerSubmitButton: 'button.govuk-button.moj-js-datepicker-ok',
  datePickerCancelButton: 'button.govuk-button.govuk-button--secondary.moj-js-datepicker-cancel',
  datePickerDialogHead: 'div.moj-datepicker__dialog-header',
  testDate: `button[data-testid="${formattedDate}"]`,

  // High-level form
  finesMacPaymentTermsForm: 'app-fines-mac-payment-terms-form',

  // Payment options
  paymentCard: 'input[id = "fm_payment_terms_payment_card_request"]',
  payInFull: 'input[id="payInFull"]',
  payByDate: 'input[id="fm_payment_terms_pay_by_date"]',
  instalmentsOnly: 'input[id="instalmentsOnly"]',
  instalmentAmount: 'input[id="fm_payment_terms_instalment_amount"]',
  startDate: 'input[id="fm_payment_terms_start_date"]',
  lumpSumPlusInstalments: 'input[id="lumpSumPlusInstalments"]',
  lumpSumAmount: 'input[id="fm_payment_terms_lump_sum_amount"]',

  //Fequency Options
  frequencyWeekly: 'input[id="W"]',
  frequencyMonthly: 'input[id="M"]',
  frequencyFortnightly: 'input[id="F"]',

  // Submit & error displays
  submitButton: 'button[type="submit"]',
  mojTicketPanel: '.moj-ticket-panel',
  govukErrorMessage: '.govuk-error-message',

  // Days in default
  hasDaysInDefault: 'input[id="fm_payment_terms_has_days_in_default"]',
  suspendedCommittalDate: 'input[id="fm_payment_terms_suspended_committal_date"]',
  defaultDaysInJail: 'input[id="fm_payment_terms_default_days_in_jail"]',

  // Enforcement action
  addEnforcementAction: 'input[id="fm_payment_terms_add_enforcement_action"]',
  pris: 'input[id="PRIS"]',
  earliestReleaseDate: 'input[id="fm_payment_terms_earliest_release_date"]',
  prisonAndPrisonNumber: 'textarea[id="fm_payment_terms_prison_and_prison_number"]',
  noenf: 'input[id="NOENF"]',
  reasonAccountIsOnNoenf: 'textarea[id="fm_payment_terms_reason_account_is_on_noenf"]',
};
