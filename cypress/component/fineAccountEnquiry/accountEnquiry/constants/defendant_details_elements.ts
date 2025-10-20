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

  // Visible labels used in assertions
  labelAccountType: 'Account type:',
  labelCaseNumber: 'PCR or case number:',
  labelBusinessUnit: 'Business Unit:',
  labelImposed: 'Imposed:',
  labelArrears: 'Arrears:',
  labelDefendant: 'Defendant',
  labelPaymentTerms: 'Payment terms',
  labelEnforcementStatus: 'Enforcement status',
  // Company details table
  companyTitle: '.govuk-summary-card__title',
  companyName: '#companyDetailsNameValue',
  companyAlias: '#companyDetailsAliasesValue',
  companyAddress: '#companyDetailsAddressValue',
  companyVehicle: '[summaryListRowId="vehicle_make_and_model"]',
  companyVehicleReg: '[summaryListRowId="vehicle_registration"]',

  // Company contact details table
  companyPrimaryEmail: '[summaryListRowId="primary_email_address"]',
  companySecondaryEmail: '[summaryListRowId="secondary_email_address"]',
  companyMobilePhone: '[summaryListRowId="mobile_telephone_number"]',
  companyHomePhone: '[summaryListRowId="home_telephone_number"]',
  companyWorkPhone: '[summaryListRowId="work_telephone_number"]',

  // Conditional tag
  statusTag: '#status',

  // Enforcement status tag
  enforcementStatusTag: ':nth-child(1) > opal-lib-govuk-tag > #enforcement_status',

  // Links
  linkText: 'a[class="govuk-link govuk-link--no-visited-state"]',
  badgeBlue: 'span[class="govuk-!-margin-bottom-2 moj-badge moj-badge--blue"]',
  badgeRed: 'span[class="govuk-!-margin-bottom-2 moj-badge moj-badge--red"]',
  // Language preferences details table
  documentLanguage: '#languagePreferencesDocument_languageValue',
  courtHearingLanguage: '#languagePreferencesHearing_languageValue',

  // Links
  defendantChange: 'a[class="govuk-!-margin-bottom-0 govuk-link"]',
};
