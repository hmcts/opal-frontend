/**
 * @file account.enquiry.defendant-details.locators.ts
 * @description
 * Shared selector and text-hook map for Account Enquiry defendant and company details tabs.
 *
 * @remarks
 * - Preserves the legacy export name used by component specs to keep migration mechanical.
 * - Includes a small number of visible-text hooks that existing tests assert directly.
 */
export const DEFENDANT_DETAILS = {
  // Defendant details table
  detailsTitle: '.govuk-summary-card__title',
  defendantName: '#defendantDetailsNameValue',
  defendantAlias: '[summaryListRowId="aliases"]',
  defendantDOB: '[summaryListRowId="dob"]',
  defendantNI: '[summaryListRowId="national_insurance_number"]',
  defendantAddress: '#defendantDetailsAddressValue',
  vehicle: '[summaryListRowId="vehicle_make_and_model"]',
  vehicleReg: '[summaryListRowId="vehicle_registration"]',

  // Defendant contact details table
  primaryEmail: '[summaryListRowId="primary_email_address"]',
  secondaryEmail: '[summaryListRowId="secondary_email_address"]',
  mobilePhone: '[summaryListRowId="mobile_telephone_number"]',
  homePhone: '[summaryListRowId="home_telephone_number"]',
  workPhone: '[summaryListRowId="work_telephone_number"]',

  // Defendant employer details table
  defendantEmployerName: '[summaryListRowId="employer_name"]',
  defendantEmployerReference: '[summaryListRowId="employer_reference"]',
  defendantEmployerEmail: '[summaryListRowId="employer_email_address"]',
  defendantEmployerPhone: '[summaryListRowId="employer_telephone_number"]',
  defendantEmployerAddress: '#employerDetailsEmployer_addressValue',

  // Parent/Guardian details table
  statusTag: '#status',
  parentGuardianTableSections: '.govuk-\\!-margin-top-2',

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
  companyName: '#companyDetailsNameValue',
  companyAlias: '#companyDetailsAliasesValue',
  companyAddress: '#companyDetailsAddressValue',

  // Company contact details table
  

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
  defendantChange: 'a.govuk-link.govuk-\\!-margin-bottom-0',
} as const;
