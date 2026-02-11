const date = new Date();
const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

export const DOM_ELEMENTS = {
  pageTitle: 'h1.govuk-heading-l',
  legend: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--s',

  //labels
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
  daysInDafaultCalculator: 'span.govuk-details__summary-text',
  addEnforcementActionLabel: 'label[for="fm_payment_terms_add_enforcement_action"]',
  prisLabel: 'label[for="fm_payment_terms_enforcement_action-PRIS"]',
  earliestReleaseDateLabel: 'label[for="fm_payment_terms_earliest_release_date"]',
  prisonAndPrisonNumberLabel: 'label[for="fm_payment_terms_prison_and_prison_number"]',
  noenfLabel: 'label[for="fm_payment_terms_enforcement_action-NOENF"]',
  reasonAccountIsOnNoenfLabel: 'label[for="fm_payment_terms_reason_account_is_on_noenf"]',
  paymentCardLabel: 'label[for="fm_payment_terms_payment_card_request"]',

  //Hints
  prisHint: 'div[id = "fm_payment_terms_prison_and_prison_number-hint"]',
  prisCharHint: 'div.govuk-character-count__message.govuk-character-count__status',
  noenfCharHint: 'div.govuk-character-count__message.govuk-character-count__status',
  dateHint: 'div.govuk-hint',
  // Collection order
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
  payInFull: 'input[name="fm_payment_terms_payment_terms"][value="payInFull"]',
  payByDate: 'input[id="fm_payment_terms_pay_by_date"]',
  instalmentsOnly: 'input[name="fm_payment_terms_payment_terms"][value="instalmentsOnly"]',
  instalmentAmount: 'input[id="fm_payment_terms_instalment_amount"]',
  startDate: 'input[id="fm_payment_terms_start_date"]',
  lumpSumPlusInstalments: 'input[name="fm_payment_terms_payment_terms"][value="lumpSumPlusInstalments"]',
  lumpSumAmount: 'input[id="fm_payment_terms_lump_sum_amount"]',

  //Fequency Options
  instalmentsOnlyFrequencyWeekly: 'input[name="instalmentsOnly"][value="W"]',
  instalmentsOnlyFrequencyMonthly: 'input[name="instalmentsOnly"][value="M"]',
  instalmentsOnlyFrequencyFortnightly: 'input[name="instalmentsOnly"][value="F"]',
  lumpSumFrequencyWeekly: 'input[name="lumpSumPlusInstalments"][value="W"]',
  lumpSumFrequencyMonthly: 'input[name="lumpSumPlusInstalments"][value="M"]',
  lumpSumFrequencyFortnightly: 'input[name="lumpSumPlusInstalments"][value="F"]',

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
  pris: 'input[name="fm_payment_terms_enforcement_action"][value="PRIS"]',
  earliestReleaseDate: 'input[id="fm_payment_terms_earliest_release_date"]',
  prisonAndPrisonNumber: 'textarea[id="fm_payment_terms_prison_and_prison_number"]',
  noenf: 'input[name="fm_payment_terms_enforcement_action"][value="NOENF"]',
  reasonAccountIsOnNoenf: 'textarea[id="fm_payment_terms_reason_account_is_on_noenf"]',

  //calculate days in default
  panel: 'opal-lib-moj-ticket-panel',
  years: 'input[id="years"]',
  months: 'input[id="months"]',
  days: 'input[id="days"]',
  weeks: 'input[id="weeks"]',
  calculatedDays: 'div.govuk-grid-column-one-half',
  caculateLink: 'span.govuk-details__summary-text',
  caculateHeading: 'h1.govuk-fieldset__heading',

  //
  yearsLabel: 'label[for="years"]',
  monthsLabel: 'label[for="months"]',
  daysLabel: 'label[for="days"]',
  weeksLabel: 'label[for="weeks"]',

  // enforcement action fieldset
  enforcementActionFieldset: 'fieldset#fm_payment_terms_enforcement_action',
  enforcementActionLegend: 'legend.govuk-fieldset__legend',
  enforcementActionRadios: 'input[type="radio"]',
};
