/**
 * @file mac.fixed-penalty.review.locators.ts
 * @description Selector map for the Manual Account Creation **Fixed Penalty review** page.
 */
export const MacFixedPenaltyReviewLocators = {
  app: 'app-fines-mac-review-account',
  header: 'h1.govuk-heading-l',
  pageHeading: 'h1.govuk-heading-l',
  backLink: 'opal-lib-govuk-back-link a.govuk-back-link',
  submitButton: '#submitAccountButton',

  summaryCards: '.govuk-summary-card',
  summaryCardTitles: '.govuk-summary-card__title',
  summaryCard: (id: string) => `[summarycardlistid="${id}"]`,
  summaryList: (id: string) => `[summarylistid="${id}"]`,
  summaryRow: '.govuk-summary-list__row',
  summaryValue: '.govuk-summary-list__value',
  changeLink: (id: string) => `#${id}-summary-card-list a.govuk-link`,

  accountDetailsCard: '[summaryCardListId="account-details"]',
  accountType: '[summaryListRowId="accountType"] dd',
  defendantType: '[summaryListRowId="defendantType"] dd',
  businessUnit: '[summaryListRowId="businessUnit"] dd',

  courtDetailsCard: '[summaryCardListId="court-details"]',
  issuingAuthority: '[summaryListRowId="issuingAuthority"] dd',
  enforcementCourt: '[summaryListRowId="enforcementCourt"] dd',

  personalDetailsCard: '[summaryCardListId="personal-details"]',
  title: '[summaryListRowId="title"] dd',
  forenames: '[summaryListRowId="forenames"] dd',
  surname: '[summaryListRowId="surname"] dd',
  dateOfBirth: '#personalDetailsDobValue, [summaryListRowId="dob"] dd',
  addressLine1: '[summaryListRowId="address"] dd',
  address: '[summaryListRowId="address"] dd',

  companyDetailsCard: '[summaryCardListId="company-details"]',
  companyName: '[summaryListRowId="companyName"] dd',
  companyAddress: '[summaryListRowId="address"] dd',
  companyPostcode: '[summaryListRowId="companyPostcode"] dd',

  languagePreferencesCard: '[summaryCardListId="language-preferences"]',
  documentLanguage: '[summaryListRowId="documentLanguage"] dd',
  hearingLanguage: '#accountDetailsCourtHearingLanguageValue',

  offenceDetailsCard: '[summaryCardListId="fp-offence-details"]',
  noticeNumber: '[summaryListRowId="noticeNumber"] dd',
  offenceType: '[summaryListRowId="offenceType"] dd',
  registrationNumber: '[summaryListRowId="registrationNumber"] dd',
  drivingLicenceNumber: '[summaryListRowId="drivingLicenceNumber"] dd',
  ntoNth: '[summaryListRowId="noticeNumber"] dd',
  dateNtoIssued: '[summaryListRowId="noticeDate"] dd',
  noticeDate: '[summaryListRowId="noticeDate"] dd',
  dateOfOffence: '[summaryListRowId="dateOfOffence"] dd',
  offenceCode: '[summaryListRowId="offenceCode"] dd',
  timeOfOffence: '[summaryListRowId="timeOfOffence"] dd',
  placeOfOffence: '[summaryListRowId="placeOfOffence"] dd',
  amountImposed: '[summaryListRowId="amountImposed"] dd',

  paymentTermsCard: '[summaryCardListId="payment-terms"]',
  paymentTerms: '[summaryListRowId="paymentTerms"] dd',
  payByDate: '[summaryListRowId="payByDate"] dd',
  instalmentAmount: '[summaryListRowId="instalmentAmount"] dd',
  instalmentPeriod: '[summaryListRowId="instalmentPeriod"] dd',

  commentsNotesCard: '[summarycardlistid="account-comments-and-notes"]',
  comments: '#accountCommentsAndNotesAccountCommentValue',
  accountNotes: '#accountCommentsAndNotesAccountNoteValue',
  accountComment: '[summaryListRowId="accountComment"] dd',
  accountNote: '[summaryListRowId="accountNote"] dd',

  notProvided: 'app-fines-not-provided',
  changeLinks: 'app-fines-mac-review-account-change-link',

  reviewAccountHistory: 'app-fines-mac-review-account-history',
  defendantName: '[data-cy=defendant-name]',
  accountStatus: '[data-cy=account-status]',
  timelineData: '[data-cy=timeline-data]',
  publishErrorBanner: 'div[type="warning"]',
  statusLabel: '#status',
  reviewHistoryEntries: 'div.moj-timeline__item',

  companyDetails: {
    companyName: '[summaryListRowId="companyName"] dd',
    companyAddress: '#companyDetailsAddressValue',
    aliases: '[summaryListRowId="aliases"] dd',
  },

  globalErrorBanner: 'div[opal-lib-moj-alert]',
  deleteReasonInput: '#fm_delete_account_confirmation_reason',
  confirmDeleteButton: '#confirmDeletion',
  deleteAccountLink: 'a.govuk-link.govuk-error-colour',
} as const;
