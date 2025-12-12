/**
 * @file fixed-penalty.locators.ts
 * @description Selector map for the Manual Account Creation **Fixed Penalty** flow
 * covering both the details form and the review page.
 *
 * @remarks
 *  - Input ids are taken directly from the Angular templates for stability.
 *  - Autocomplete fields use the generated `-autocomplete` input/listbox ids.
 */
export const FixedPenaltyDetailsLocators = {
  header: 'h1.govuk-heading-l',
  issuingAuthorityInput: 'input[id="fm_fp_court_details_originator_id-autocomplete"]',
  issuingAuthorityListbox: 'ul[id="fm_fp_court_details_originator_id-autocomplete__listbox"]',
  enforcementCourtInput: 'input[id="fm_fp_court_details_imposing_court_id-autocomplete"]',
  enforcementCourtListbox: 'ul[id="fm_fp_court_details_imposing_court_id-autocomplete__listbox"]',
  titleSelect: '#fm_fp_personal_details_title',
  firstNamesInput: '#fm_fp_personal_details_forenames',
  lastNameInput: '#fm_fp_personal_details_surname',
  dobInput: '#fm_fp_personal_details_dob',
  addressLine1Input: '#fm_fp_personal_details_address_line_1',
  addressLine2Input: '#fm_fp_personal_details_address_line_2',
  addressLine3Input: '#fm_fp_personal_details_address_line_3',
  postcodeInput: '#fm_fp_personal_details_post_code',
  companyNameInput: '#fm_fp_company_details_company_name',
  companyAddressLine1Input: '#fm_fp_company_details_address_line_1',
  companyAddressLine2Input: '#fm_fp_company_details_address_line_2',
  companyAddressLine3Input: '#fm_fp_company_details_address_line_3',
  companyPostcodeInput: '#fm_fp_company_details_postcode',
  noticeNumberInput: '#fm_fp_offence_details_notice_number',
  offenceTypeRadio: (value: string) =>
    `[opal-lib-govuk-radios-item][inputvalue="${value}"] input[type="radio"]`,
  dateOfOffenceInput: '#fm_fp_offence_details_date_of_offence',
  offenceCodeInput: '#fm_fp_offence_details_offence_cjs_code',
  timeOfOffenceInput: '#fm_fp_offence_details_time_of_offence',
  placeOfOffenceInput: '#fm_fp_offence_details_place_of_offence',
  amountImposedInput: '#fm_fp_offence_details_amount_imposed',
  vehicleRegistrationInput: '#fm_fp_offence_details_vehicle_registration_number',
  drivingLicenceInput: '#fm_fp_offence_details_driving_licence_number',
  ntoNumberInput: '#fm_fp_offence_details_nto_nth',
  dateNtoIssuedInput: '#fm_fp_offence_details_date_nto_issued',
  commentInput: '#fm_fp_account_comments_notes_comments',
  noteInput: '#fm_fp_account_comments_notes_notes',
  reviewButton: '#submitForm',
  backLink: 'a.govuk-back-link',
} as const;

export const FixedPenaltyReviewLocators = {
  header: 'h1.govuk-heading-l',
  summaryCard: (id: string) => `[summarycardlistid="${id}"]`,
  summaryList: (id: string) => `[summarylistid="${id}"]`,
  summaryRow: '.govuk-summary-list__row',
  summaryValue: '.govuk-summary-list__value',
  changeLink: (id: string) => `#${id}-summary-card-list a.govuk-link`,
  submitForReviewButton: '#submitAccountButton',
  deleteAccountLink: 'a.govuk-link.govuk-error-colour',
  backLink: 'a.govuk-back-link',
  globalErrorBanner: 'div[opal-lib-moj-alert]',
  deleteReasonInput: '#fm_delete_account_confirmation_reason',
  confirmDeleteButton: '#confirmDeletion',
} as const;
