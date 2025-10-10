const date = new Date();
const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

export const DOM_ELEMENTS = {
  app: 'app-fines-mac-offence-details-add-an-offence-form',
  pageTitle: 'h1.govuk-heading-l',
  legend: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
  errorSummary: 'div.govuk-error-summary',

  //Inputs
  dateOfSentenceInput: 'input[id = "fm_offence_details_date_of_sentence"]',
  offenceCodeInput: 'input[id = "fm_offence_details_offence_cjs_code"]',

  //labels
  dateOfSentenceLabel: 'label[for = "fm_offence_details_date_of_sentence"]',
  dateHint: 'div[id = "date-hint"]',
  offenceCodeLabel: 'label[for = "fm_offence_details_offence_cjs_code"]',
  offenceCodeHint: 'div[id = "fm_offence_details_offence_cjs_code-hint"]',

  //buttons
  addImpositionButton: 'button[id = "addImposition"]',
  submitButton: 'button[type = "submit"]',
  addAnotherOffenceButton: 'button[type = "submit"]:contains("Add another offence")',

  //ticket panel
  ticketPanel: 'opal-lib-moj-ticket-panel',
  successPanel: 'section.moj-ticket-panel__content.moj-ticket-panel__content--blue',
  invalidPanel: 'section.moj-ticket-panel__content.moj-ticket-panel__content--orange',

  //date picker
  datePickerButton: 'button.moj-datepicker__toggle.moj-js-datepicker-toggle',
  datePickerDateOfSentenceElement: 'div[id = "datepicker-fm_offence_details_date_of_sentence"]',
  datePickerSubmitButton: 'button.govuk-button.moj-js-datepicker-ok',
  datePickerCancelButton: 'button.govuk-button.govuk-button--secondary.moj-js-datepicker-cancel',
  datePickerDialogHead: 'div.moj-datepicker__dialog-header',
  testDate: `button[data-testid = "${formattedDate}"]`,

  //link
  offenceLink: 'a.govuk-link.govuk-task-list_link.govuk-link--no-visited-state',
  minorCreditorLink: 'a:contains("Add minor creditor details")',
  removeImpositionLink: 'a:contains("Remove imposition")',
};

export const impostitionSelectors = (number: number) => ({
  resultCodeAutoComplete: `ul[id = "fm_offence_details_result_id_${number}-autocomplete__listbox"]`,
  resultCodeInput: `input[id = "fm_offence_details_result_id_${number}-autocomplete"]`,
  amountImposedInput: `input[id = "fm_offence_details_amount_imposed_${number}"]`,
  amountPaidInput: `input[id = "fm_offence_details_amount_paid_${number}"]`,
  resultCodeLabel: `label[for = "fm_offence_details_result_id_${number}-autocomplete"]`,
  resultCodeAutoCompleteValues: `ul[id = "fm_offence_details_result_id_${number}-autocomplete__listbox"]`,
  amountImposedLabel: `label[for = "fm_offence_details_amount_imposed_${number}"]`,
  amountPaidLabel: `label[for = "fm_offence_details_amount_paid_${number}"]`,
  majorCreditor: `input[id = "major_${number}"]`,
  majorCreditorLabel: `label[for = "major_${number}"]`,
  minorCreditor: `input[id = "minor_${number}"]`,
  minorCreditorLabel: `label[for = "minor_${number}"]`,
  majorCreditorCode: `input[id = "fm_offence_details_major_creditor_id_${number}-autocomplete"]`,
  majorCreditorCodeLabel: `label[for = "fm_offence_details_major_creditor_id_${number}-autocomplete"]`,
});
