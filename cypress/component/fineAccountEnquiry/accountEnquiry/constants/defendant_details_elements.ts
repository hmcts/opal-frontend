// Stable selectors / visible text hooks for the Defendant Details page.

export const DEFENDANT_DETAILS = {
  // Defendant details table
  defendantTitle: '.govuk-summary-card__title',
  defendantName: '#defendantDetailsNameValue',
  defendantAlias: '[summaryListRowId="aliases"]',
  defendantDOB: '[summaryListRowId="dob"]',
  defendantNI: '[summaryListRowId="national_insurance_number"]',
  defendantAddress: '#personalDetailsAddressValue',
  defendantVehicle: '[summaryListRowId="vehicle_make_and_model"]',
  defendantVehicleReg: '[summaryListRowId="vehicle_registration"]',

  // Defendant contact details table
  defendantPrimaryEmail: '[summaryListRowId="primary_email_address"]',
  defendantSecondaryEmail: '[summaryListRowId="secondary_email_address"]',
  defendantMobilePhone: '[summaryListRowId="mobile_telephone_number"]',
  defendantHomePhone: '[summaryListRowId="home_telephone_number"]',
  defendantWorkPhone: '[summaryListRowId="work_telephone_number"]',

  // Defendant employer details table
  defendantEmployerName: '[summaryListRowId="employer_name"]',
  defendantEmployerReference: '[summaryListRowId="employer_reference"]',
  defendantEmployerEmail: '[summaryListRowId="employer_email_address"]',
  defendantEmployerPhone: '[summaryListRowId="employer_telephone_number"]',
  defendantEmployerAddress: '#employerDetailsEmployer_addressValue',

  //Language preferences details table
  documentLanguage: '#languagePreferencesDocument_languageValue',
  courtHearingLanguage: '#languagePreferencesHearing_languageValue',

  // Links
  defendantChange: 'a[class="govuk-!-margin-bottom-0 govuk-link"]',
};
