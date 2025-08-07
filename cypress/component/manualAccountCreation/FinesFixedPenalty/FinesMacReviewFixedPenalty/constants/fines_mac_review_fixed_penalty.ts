export const DOM_ELEMENTS = {
  // Main component elements
  app: 'app-fines-mac-review-account',
  pageHeading: 'h1.govuk-heading-l',
  backLink: 'opal-lib-govuk-back-link',
  submitButton: '#submitAccountButton',

  // Summary card elements
  summaryCards: '.govuk-summary-card',
  summaryCardTitles: '.govuk-summary-card__title',

  // Account Details section
  accountDetailsCard: '[summaryCardListId="account-details"]',
  accountType: '[summaryListRowId="accountType"] dd',
  defendantType: '[summaryListRowId="defendantType"] dd',
  businessUnit: '[summaryListRowId="businessUnit"] dd',

  // Court Details section
  courtDetailsCard: '[summaryCardListId="court-details"]',
  issuingAuthority: '[summaryListRowId="issuingAuthority"] dd',
  enforcementCourt: '[summaryListRowId="enforcementCourt"] dd',

  // Personal Details section
  personalDetailsCard: '[summaryCardListId="personal-details"]',
  title: '[summaryListRowId="title"] dd',
  forenames: '[summaryListRowId="forenames"] dd',
  surname: '[summaryListRowId="surname"] dd',
  dateOfBirth: '#personalDetailsDobValue',
  addressLine1: '[summaryListRowId="address"] dd',

  // Company Details section (for company defendant type)
  companyDetailsCard: '[summaryCardListId="company-details"]',
  companyName: '[summaryListRowId="companyName"] dd',
  companyAddress: '[summaryListRowId="companyAddress"] dd',
  companyPostcode: '[summaryListRowId="companyPostcode"] dd',

  // Language Preferences section
  languagePreferencesCard: '[summaryCardListId="language-preferences"]',
  documentLanguage: '[summaryListRowId="documentLanguage"] dd',
  hearingLanguage: '#accountDetailsCourtHearingLanguageValue',

  // Fixed Penalty Offence Details section
  offenceDetailsCard: '[summaryCardListId="fp-offence-details"]',
  noticeNumber: '[summaryListRowId="noticeNumber"] dd',
  offenceType: '[summaryListRowId="offenceType"] dd',
  registrationNumber: '[summaryListRowId="registrationNumber"] dd',
  drivingLicenceNumber: '[summaryListRowId="drivingLicenceNumber"] dd',
  ntoNth: '[summaryListRowId="noticeNumber"] dd',
  dateNtoIssued: '[summaryListRowId="noticeDate"] dd',
  dateOfOffence: '[summaryListRowId="dateOfOffence"] dd',
  offenceCode: '[summaryListRowId="offenceCode"] dd',
  timeOfOffence: '[summaryListRowId="timeOfOffence"] dd',
  placeOfOffence: '[summaryListRowId="placeOfOffence"] dd',
  amountImposed: '[summaryListRowId="amountImposed"] dd',

  // Payment Terms section
  paymentTermsCard: '[summaryCardListId="payment-terms"]',
  paymentTerms: '[summaryListRowId="paymentTerms"] dd',
  payByDate: '[summaryListRowId="payByDate"] dd',
  instalmentAmount: '[summaryListRowId="instalmentAmount"] dd',
  instalmentPeriod: '[summaryListRowId="instalmentPeriod"] dd',

  // Comments and Notes section
  commentsNotesCard: '[summarycardlistid="account-comments-and-notes"]',
  comments: '#accountCommentsAndNotesAccountCommentValue',
  accountNotes: '#accountCommentsAndNotesAccountNoteValue',

  // Not provided placeholder
  notProvided: 'app-fines-mac-review-account-not-provided',

  // Change links
  changeLinks: 'app-fines-mac-review-account-change-link',

  // History elements (when in read-only mode)
  reviewAccountHistory: 'app-fines-mac-review-account-history',
  defendantName: '[data-cy=defendant-name]',
  accountStatus: '[data-cy=account-status]',
  timelineData: '[data-cy=timeline-data]',

  // Company Elements
  companyDetails: {
    companyName: '[summaryListRowId="companyName"] dd',
    companyAddress: '#companyDetailsAddressValue',
    aliases: '[summaryListRowId="aliases"] dd',
  },
};
