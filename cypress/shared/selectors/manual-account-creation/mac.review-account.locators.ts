/**
 * @file mac.review-account.locators.ts
 * @description Stable selectors for the Manual Account Creation **Check account details** page.
 *
 * @remarks
 * - Uses summary list ids exposed in the review components.
 * - Buttons use explicit ids set via `opal-lib-govuk-button`.
 */
export const MacReviewAccountLocators = {
  // Layout
  app: 'div.govuk-grid-column-full',
  header: 'h1.govuk-heading-l',
  heading: 'h1.govuk-heading-l',
  backLink: 'a.govuk-back-link',

  // Alerts
  errorBanner: 'app-fines-mac-review-account-failed-banner',

  // Summary cards
  summaryCard: 'opal-lib-govuk-summary-card-list',

  // Primary actions
  checkAccountButton: '#checkAccountButton',
  submitForReviewButton: '#submitAccountButton',
  submitButton: '#submitAccountButton',

  // Summary list helpers
  summaryList: (id: string) => `[summarylistid="${id}"]`,
  summaryRow: '.govuk-summary-list__row',
  summaryKey: '.govuk-summary-list__key',
  summaryValue: '.govuk-summary-list__value',

  // Account details
  businessUnitData: 'div[id = "accountDetailsBusinessUnit"]',
  accountTypeData: 'div[id = "accountDetailsAccountType"]',
  defendantTypeData: 'div[id = "accountDetailsDefendantType"]',
  langPrefDocLanguage: '[id="accountDetailsDocumentLanguage"]',
  langPrefCourtHeatingLanguage: '[id="accountDetailsCourtHearingLanguage"]',

  // Court details
  originatorName: 'div[id = "courtDetailsOriginatorName"]',
  prosecutorCaseReference: 'div[id = "courtDetailsPcr"]',
  enforcementCourt: 'div[id = "courtDetailsEnforcementCourt"]',

  // Personal details
  summaryTitle: 'div.govuk-summary-card__title-wrapper',
  title: 'div[id = "personalDetailsTitle"]',
  forenames: 'div[id = "personalDetailsForenames"]',
  surname: 'div[id = "personalDetailsSurname"]',
  aliases: 'div[id = "personalDetailsAliases"]',
  dob: 'div[id = "personalDetailsDob"]',
  nationalInsuranceNumber: 'div[id = "personalDetailsNationalInsuranceNumber"]',
  address: 'div[id = "personalDetailsAddress"]',
  vehicleMakeOrModel: 'div[id = "personalDetailsVehicleMakeOrModel"]',
  registrationNumber: 'div[id = "personalDetailsRegistrationNumber"]',

  // Contact details
  primaryEmailAddress: 'div[id = "contactDetailsPrimaryEmailAddress"]',
  secondaryEmailAddress: 'div[id = "contactDetailsSecondaryEmailAddress"]',
  mobileTelephoneNumber: 'div[id = "contactDetailsMobileTelephoneNumber"]',
  homeTelephoneNumber: 'div[id = "contactDetailsHomeTelephoneNumber"]',
  workTelephoneNumber: 'div[id = "contactDetailsWorkTelephoneNumber"]',

  // Employer details
  employerName: 'div[id = "employerDetailsEmployerName"]',
  employeeReference: 'div[id = "employerDetailsEmployeeReference"]',
  employerEmailAddress: 'div[id = "employerDetailsEmployerEmailAddress"]',
  employerTelephoneNumber: 'div[id = "employerDetailsEmployerTelephoneNumber"]',
  employerAddress: 'div[id = "employerDetailsEmployerAddress"]',

  // Offences and impositions (review summary)
  headingLarge: 'h1.govuk-heading-l',
  headingMedium: 'h2.govuk-heading-m',
  dateOfSentence: 'div[id = "dateOfSentenceDateOfSentence"]',
  offencecode: 'app-fines-mac-offence-details-review-offence-heading-title',
  tableHeadings: 'th.govuk-table__header',
  impositionType: 'td[id ="imposition"]',
  creditor: 'td[id ="creditor"]',
  amountImposed: 'td[id ="amountImposed"]',
  amountPaid: 'td[id ="amountPaid"]',
  balanceRemaining: 'td[id ="balanceRemaining"]',
  minorCreditorPaymentMethodValue: 'dd[id="minorCreditorDataTablePaymentMethodValue"]',
  totalHeading: 'th[id="totalsHeading"]',
  totalAmountImposed: 'th[id="totalAmountImposed"]',
  totalAmountPaid: 'th[id="totalAmountPaid"]',
  totalBalanceRemaining: 'th[id="totalBalanceRemaining"]',
  GrandtotalAmountImposed: 'div[id ="offencesTotalAmountImposedTotals"]',
  GrandtotalAmountPaid: 'div[id ="offencesTotalAmountPaidTotals"]',
  GrandtotalRemainingBalance: 'div[id = "offencesTotalBalanceRemainingTotals"]',

  offences: {
    impositionCells: 'td#imposition',
    creditorCells: 'td#creditor',
    amountImposedCells: 'td#amountImposed',
    amountPaidCells: 'td#amountPaid',
    balanceRemainingCells: 'td#balanceRemaining',
    totals: {
      heading: '#totalsHeading',
      amountImposed: '#totalAmountImposed',
      amountPaid: '#totalAmountPaid',
      balanceRemaining: '#totalBalanceRemaining',
    },
    minorCreditorToggle: 'a.govuk-link.govuk-link--no-visited-state',
    minorCreditorSummaryId: 'minorCreditorDataTable',
  },

  // Payment terms
  paymentTerms: 'div[id = "paymentTermsSelectedPaymentTerms"]',
  payByDate: 'div[id = "paymentTermsPayByDate"]',
  requestPaymentCard: 'div[id = "paymentTermsRequestPaymentCard"]',
  hasDaysInDefault: 'div[id = "paymentTermsHasDaysInDefault"]',
  enforcementActions: 'div[id = "paymentTermsHasEnforcementActions"]',

  // Account comments and notes
  comments: 'div[id = "accountCommentsAndNotesAccountComment"]',
  accountNotes: 'div[id = "accountCommentsAndNotesAccountNote"]',

  // Parent or guardian details
  PGforenames: 'div[id = "parentGuardianDetailsForenames"]',
  PGsurname: 'div[id = "parentGuardianDetailsSurname"]',
  PGAliases: 'div[id = "parentGuardianDetailsAliases"]',
  PGdob: 'div[id = "parentGuardianDetailsDob"]',
  PGnationalInsuranceNumber: 'div[id = "parentGuardianDetailsNationalInsuranceNumber"]',
  PGaddress: 'div[id = "parentGuardianDetailsAddress"]',
  PGvehicleMakeOrModel: 'div[id = "parentGuardianDetailsVehicleMakeOrModel"]',
  PGregistrationNumber: 'div[id = "parentGuardianDetailsRegistrationNumber"]',

  // Company details
  companyName: 'div[id = "companyDetailsCompanyName"]',
  companyAliases: 'div[id = "companyDetailsAliases"]',
  companyAddress: 'div[id = "companyDetailsAddress"]',

  // Links
  changeLink: 'a.govuk-link.govuk-link--no-visited-state',
  deleteLink: 'a.govuk-link.govuk-error-colour',

  // Review history
  reviewComponent: 'app-fines-mac-review-account-history',
  status: 'strong[id = "status"]',
  reviewHistory: 'h2.govuk-heading-m',
  timeLine: 'div.moj-timeline__item',
  timeLineTitle: 'h2.moj-timeline__title',
  timelineAuthor: 'p.moj-timeline__byline',
  timelineDate: 'p.moj-timeline__date',
  timelineDescription: '.moj-timeline__description',
  accountStatus: 'strong[id="status"]',
  timeLineStatus: 'h2.moj-timeline__title',

  // Decision section
  approveRadioButton: 'input[name="fm_review_account_decision"][value="approve"]',
  rejectRadioButton: 'input[name="fm_review_account_decision"][value="reject"]',
  rejectionText: 'label[for="fm_review_account_decision_reason"]',
  continue: 'button[id = "submitForm"]',
  textArea: 'textarea[id="fm_review_account_decision_reason"]',
} as const;
