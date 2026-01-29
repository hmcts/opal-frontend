/**
 * @file offence-details.locators.ts
 * @description Selector map for the Manual Account Creation **Offence details** task.
 *
 * @remarks
 * - Includes offence/imposition inputs, autocomplete listboxes, and navigation CTAs.
 * - Keep selectors centralized for Cypress actions/flows.
 */
import { CommonLocators as Common } from '../common.locators';

export const ManualOffenceDetailsLocators = {
  pageHeader: Common.pageHeader,
  dateOfSentenceInput: 'input[id = "fm_offence_details_date_of_sentence"]',
  offenceCodeInput: 'input[id = "fm_offence_details_offence_cjs_code"]',
  addImpositionButton: '#addImposition',
  addAnotherOffenceButton: 'button.nested-flow:contains("Add another offence")',
  reviewOffenceButton: 'button[type="submit"]:contains("Review offence")',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
  cancelLink: 'a.button-link, button.button-link, [role="button"].button-link',
  searchOffenceLink: 'a[href*="search-offences"]',
  imposition: {
    container: 'opal-lib-moj-ticket-panel',
    resultCodeInput: (index: number) => `input[id = "fm_offence_details_result_id_${index}-autocomplete"]`,
    resultCodeList: (index: number) => `ul[id = "fm_offence_details_result_id_${index}-autocomplete__listbox"]`,
    amountImposedInput: (index: number) => `input[id = "fm_offence_details_amount_imposed_${index}"]`,
    amountPaidInput: (index: number) => `input[id = "fm_offence_details_amount_paid_${index}"]`,
    creditorRadio: (type: 'major' | 'minor', index: number) => `#${type}_${index}`,
    majorCreditorInput: (index: number) => `input[id = "fm_offence_details_major_creditor_id_${index}-autocomplete"]`,
    majorCreditorList: (index: number) =>
      `ul[id = "fm_offence_details_major_creditor_id_${index}-autocomplete__listbox"]`,
    addMinorCreditorLink: 'a:contains("Add minor creditor details")',
    removeImpositionLink: 'a:contains("Remove imposition")',
    minorCreditorSummary: 'app-fines-mac-offence-details-minor-creditor-information',
    showMinorCreditorLink: 'a:contains("Show details")',
    changeMinorCreditorLink: 'a:contains("Change")',
    removeMinorCreditorLink: 'a:contains("Remove")',
    legend: 'legend',
    fieldset: 'fieldset.govuk-fieldset',
  },
  minorCreditorForm: {
    pageHeader: Common.pageHeader,
    individualRadio: '#individual',
    companyRadio: '#company',
    titleSelect: '#fm_offence_details_minor_creditor_title',
    firstNamesInput: '#fm_offence_details_minor_creditor_forenames',
    lastNameInput: '#fm_offence_details_minor_creditor_surname',
    companyNameInput: '#fm_offence_details_minor_creditor_company_name',
    address1Input: '#fm_offence_details_minor_creditor_address_line_1',
    address2Input: '#fm_offence_details_minor_creditor_address_line_2',
    address3Input: '#fm_offence_details_minor_creditor_address_line_3',
    postcodeInput: '#fm_offence_details_minor_creditor_post_code',
    payByBacsCheckbox: '#fm_offence_details_minor_creditor_pay_by_bacs',
    accountNameInput: '#fm_offence_details_minor_creditor_bank_account_name',
    sortCodeInput: '#fm_offence_details_minor_creditor_bank_sort_code',
    accountNumberInput: '#fm_offence_details_minor_creditor_bank_account_number',
    paymentReferenceInput: '#fm_offence_details_minor_creditor_bank_account_ref',
    saveButton: '#submitForm',
    cancelLink: 'a.button-link, button.button-link, [role="button"].button-link',
  },
  removeMinorCreditor: {
    pageHeader: Common.pageHeader,
    confirmButton: '#confirmDeletion',
    cancelLink: 'a:contains("No - cancel")',
  },
  removeImposition: {
    pageHeader: Common.pageHeader,
    confirmButton: '#confirmDeletion',
    cancelLink: 'a:contains("No - cancel")',
    table: 'opal-lib-govuk-table',
  },
  removeOffence: {
    pageHeader: Common.pageHeader,
    confirmButton: '#confirmDeletion',
    cancelLink: 'a:contains("No - cancel")',
  },
  review: {
    pageHeader: Common.pageHeader,
    offenceComponent: 'app-fines-mac-offence-details-review-offence',
    offenceCaption: 'span.govuk-caption-m',
    impositionTable: 'opal-lib-govuk-table',
    totalsSummaryList: '[summaryListId="offencesTotal"]',
    returnToAccountDetailsButton: '#returnToCreateAccount',
    addPaymentTermsButton: 'button:contains("Add payment terms")',
    addAnotherOffenceButton: 'button#addAnOffence, button:contains("Add another offence")',
  },
  search: {
    pageHeader: Common.pageHeader,
    offenceCodeInput: '#fm_offence_details_search_offences_code',
    shortTitleInput: '#fm_offence_details_search_offences_short_title',
    actAndSectionInput: '#fm_offence_details_search_offences_act_section',
    includeInactiveCheckbox: '#fm_offence_details_search_offences_inactive',
    searchButton: '#submitForm',
    backLink: '.govuk-back-link',
    resultsTable: 'opal-lib-moj-sortable-table',
  },
} as const;
