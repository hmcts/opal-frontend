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
  defendantAlias: '#defendantDetailsAliasesValue',
  defendantDOB: '#defendantDetailsDobValue',
  defendantNI: '#defendantDetailsNational_insurance_numberValue',
  defendantAddress: '#defendantDetailsAddressValue',
  vehicle: '#defendantDetailsVehicle_make_and_modelValue',
  vehicleReg: '#defendantDetailsVehicle_registrationValue',

  // Defendant contact details table
  primaryEmail: '#contactDetailsPrimary_email_addressValue',
  secondaryEmail: '#contactDetailsSecondary_email_addressValue',
  mobilePhone: '#contactDetailsMobile_telephone_numberValue',
  homePhone: '#contactDetailsHome_telephone_numberValue',
  workPhone: '#contactDetailsWork_telephone_numberValue',

  // Defendant employer details table
  defendantEmployerName: '#employerDetailsEmployer_nameValue',
  defendantEmployerReference: '#employerDetailsEmployer_referenceValue',
  defendantEmployerEmail: '#employerDetailsEmployer_email_addressValue',
  defendantEmployerPhone: '#employerDetailsEmployer_telephone_numberValue',
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
  companyVehicle: '#companyDetailsVehicle_make_and_modelValue',
  companyVehicleReg: '#companyDetailsVehicle_registrationValue',

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
  convertActionLink: '#defendant-convert-action-link',
  defendantChange: '#defendant-summary-card-list .govuk-summary-card__actions a',
  companyChange: '#company-summary-card-list .govuk-summary-card__actions a',
} as const;
