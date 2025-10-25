export const DOM_ELEMENTS = {
  app: 'app-fines-mac-fixed-penalty-details-form',
  pageTitle: 'h1.govuk-heading-l',

  issuingAuthorityInput: 'input[id="fm_fp_court_details_originator_id-autocomplete"]',
  enforcementCourtInput: 'input[id="fm_fp_court_details_imposing_court_id-autocomplete"]',
  issuingAuthorityDropDown: '[id^="fm_fp_court_details_originator_id-autocomplete__option"]',
  enforcementCourtDropDown: '[id^="fm_fp_court_details_imposing_court_id-autocomplete__option"]',
  companyName: '#fm_fp_company_details_company_name',

  titleSelect: 'select[id="fm_fp_personal_details_title"]',
  firstNameInput: 'input[id="fm_fp_personal_details_forenames"]',
  lastNameInput: 'input[id="fm_fp_personal_details_surname"]',
  dobInput: 'input[id="fm_fp_personal_details_dob"]',
  ageCalcDisplay: '.age-calculation',
  ageTypeDisplay: '.age-type',

  addressLine1Input: 'input[id="fm_fp_personal_details_address_line_1"]',
  addressLine2Input: 'input[id="fm_fp_personal_details_address_line_2"]',
  addressLine3Input: 'input[id="fm_fp_personal_details_address_line_3"]',
  postcodeInput: 'input[id="fm_fp_personal_details_post_code"]',

  companyAddressLine1Input: '#fm_fp_company_details_address_line_1',
  companyAddressLine2Input: '#fm_fp_company_details_address_line_2',
  companyAddressLine3Input: '#fm_fp_company_details_address_line_3',
  companyPostcodeInput: '#fm_fp_company_details_postcode',

  noticeNumberInput: 'input[id="fm_fp_offence_details_notice_number"]',
  vehicleRadioButton: '[labeltext="Vehicle"] > #fm_fp_offence_details_offence_type',
  nonVehicleRadioButton: '[labeltext="Non-Vehicle"] > #fm_fp_offence_details_offence_type',
  vehicleRegistrationInput: 'input[id="fm_fp_offence_details_vehicle_registration_number"]',
  drivingLicenceInput: 'input[id="fm_fp_offence_details_driving_licence_number"]',
  ntoNthInput: 'input[id="fm_fp_offence_details_nto_nth"]',
  dateNtoIssuedInput: 'input[id="fm_fp_offence_details_date_nto_issued"]',
  dateOfOffenceInput: 'input[id="fm_fp_offence_details_date_of_offence"]',
  offenceCodeInput: 'input[id="fm_fp_offence_details_offence_cjs_code"]',
  timeOfOffenceInput: 'input[id="fm_fp_offence_details_time_of_offence"]',
  placeOfOffenceInput: 'textarea[id="fm_fp_offence_details_place_of_offence"]',
  placeOfOffenceInputHint: '#fm_fp_offence_details_place_of_offence-hint',
  amountImposedInput: 'input[id="fm_fp_offence_details_amount_imposed"]',
  offenceStatus: '.moj-ticket-panel__content',
  offenceStatusMessage: 'strong',

  commentsInput: 'textarea[id="fm_fp_account_comments_notes_comments"]',
  commentsInputHint: '[labeltext="Add comment"] > .govuk-form-group > .govuk-character-count__status',
  accountNoteInput: 'textarea[id="fm_fp_account_comments_notes_notes"]',
  accountNoteInputHint: '[labeltext="Add account notes"] > .govuk-form-group > .govuk-character-count__status',

  documentLanguageSelect: '#fm_language_preferences_document_language',
  hearingLanguageSelect: '#fm_language_preferences_hearing_language',

  cancelLink: 'a.govuk-link.button-link',
  submitButton: 'button[type="submit"]',

  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  errorSummaryList: '.govuk-error-summary__list',
};
