/**
 * @file mac.fixed-penalty.details.locators.ts
 * @description Selector map for the Manual Account Creation **Fixed Penalty details** page.
 */
export const MacFixedPenaltyDetailsLocators = {
  header: 'h1.govuk-heading-l',
  app: 'app-fines-mac-fixed-penalty-details-form',
  pageTitle: 'h1.govuk-heading-l',

  issuingAuthorityInput: 'input[id="fm_fp_court_details_originator_id-autocomplete"]',
  issuingAuthorityListbox: 'ul[id="fm_fp_court_details_originator_id-autocomplete__listbox"]',
  issuingAuthorityDropDown: '[id^="fm_fp_court_details_originator_id-autocomplete__option"]',
  enforcementCourtInput: 'input[id="fm_fp_court_details_imposing_court_id-autocomplete"]',
  enforcementCourtListbox: 'ul[id="fm_fp_court_details_imposing_court_id-autocomplete__listbox"]',
  enforcementCourtDropDown: '[id^="fm_fp_court_details_imposing_court_id-autocomplete__option"]',

  titleSelect: 'select[id="fm_fp_personal_details_title"]',
  firstNamesInput: '#fm_fp_personal_details_forenames',
  firstNameInput: 'input[id="fm_fp_personal_details_forenames"]',
  lastNameInput: 'input[id="fm_fp_personal_details_surname"]',
  dobInput: 'input[id="fm_fp_personal_details_dob"]',
  ageCalcDisplay: '.age-calculation',
  ageTypeDisplay: '.age-type',

  addressLine1Input: 'input[id="fm_fp_personal_details_address_line_1"]',
  addressLine2Input: 'input[id="fm_fp_personal_details_address_line_2"]',
  addressLine3Input: 'input[id="fm_fp_personal_details_address_line_3"]',
  postcodeInput: 'input[id="fm_fp_personal_details_post_code"]',

  companyNameInput: '#fm_fp_company_details_company_name',
  companyName: '#fm_fp_company_details_company_name',
  companyAddressLine1Input: '#fm_fp_company_details_address_line_1',
  companyAddressLine2Input: '#fm_fp_company_details_address_line_2',
  companyAddressLine3Input: '#fm_fp_company_details_address_line_3',
  companyPostcodeInput: '#fm_fp_company_details_postcode',

  noticeNumberInput: '#fm_fp_offence_details_notice_number',
  offenceTypeRadio: (value: string) => `[opal-lib-govuk-radios-item][inputvalue="${value}"] input[type="radio"]`,
  vehicleRadioButton: 'input[name="fm_fp_offence_details_offence_type"][value="vehicle"]',
  nonVehicleRadioButton: 'input[name="fm_fp_offence_details_offence_type"][value="non-vehicle"]',
  dateOfOffenceInput: '#fm_fp_offence_details_date_of_offence',
  offenceCodeInput: '#fm_fp_offence_details_offence_cjs_code',
  searchOffenceListLink: 'a[href*="search-offences"]',
  timeOfOffenceInput: '#fm_fp_offence_details_time_of_offence',
  placeOfOffenceInput: '#fm_fp_offence_details_place_of_offence',
  placeOfOffenceInputHint: '#fm_fp_offence_details_place_of_offence-hint',
  amountImposedInput: '#fm_fp_offence_details_amount_imposed',
  offenceStatus: '.moj-ticket-panel__content',
  offenceStatusMessage: 'strong',

  vehicleRegistrationInput: '#fm_fp_offence_details_vehicle_registration_number',
  drivingLicenceInput: '#fm_fp_offence_details_driving_licence_number',
  ntoNumberInput: '#fm_fp_offence_details_nto_nth',
  ntoNthInput: 'input[id="fm_fp_offence_details_nto_nth"]',
  dateNtoIssuedInput: '#fm_fp_offence_details_date_nto_issued',

  commentInput: '#fm_fp_account_comments_notes_comments',
  noteInput: '#fm_fp_account_comments_notes_notes',
  commentsInput: 'textarea[id="fm_fp_account_comments_notes_comments"]',
  commentsInputHint: 'div.govuk-character-count__message.govuk-character-count__status',
  accountNoteInput: 'textarea[id="fm_fp_account_comments_notes_notes"]',
  accountNoteInputHint: 'div.govuk-character-count__message.govuk-character-count__status',

  documentLanguageSelect: 'input[name="fm_fp_language_preferences_document_language"][value="EN"]',
  hearingLanguageSelect: 'input[name="fm_fp_language_preferences_hearing_language"][value="EN"]',

  reviewButton: '#submitForm',
  submitButton: 'button[type="submit"]',
  backLink: 'a.govuk-back-link',
  cancelLink: 'a.govuk-link.button-link',

  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  errorSummaryList: '.govuk-error-summary__list',
} as const;
