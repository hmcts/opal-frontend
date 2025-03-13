export const DOM_ELEMENTS = {
  app: 'div.govuk-grid-column-full',
  heading: 'h1.govuk-heading-l',
  backLink: 'a.govuk-back-link',

  //Account details
  businessUnitData: 'div[id = "accountDetailsBusinessUnit"]',
  accountTypeData: 'div[id = "accountDetailsAccountType"]',
  defendantTypeData: 'div[id = "accountDetailsDefendantType"]',

  //court details
  originatorName: 'div[id = "courtDetailsOriginatorName"]',
  prosecutorCaseReference: 'div[id = "courtDetailsPcr"]',
  enforcementCourt: 'div[id = "courtDetailsEnforcementCourt"]',

  //Personal details
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

  //Contact details
  primaryEmailAddress: 'div[id = "contactDetailsPrimaryEmailAddress"]',
  secondaryEmailAddress: 'div[id = "contactDetailsSecondaryEmailAddress"]',
  mobileTelephoneNumber: 'div[id = "contactDetailsMobileTelephoneNumber"]',
  homeTelephoneNumber: 'div[id = "contactDetailsHomeTelephoneNumber"]',
  workTelephoneNumber: 'div[id = "contactDetailsWorkTelephoneNumber"]',

  //Employer details
  employerName: 'div[id = "employerDetailsEmployerName"]',
  employeeReference: 'div[id = "employerDetailsEmployeeReference"]',
  employerEmailAddress: 'div[id = "employerDetailsEmployerEmailAddress"]',
  employerTelephoneNumber: 'div[id = "employerDetailsEmployerTelephoneNumber"]',
  employerAddress: 'div[id = "employerDetailsEmployerAddress"]',

  //Offences and impositions
  headingLarge: 'h1.govuk-heading-l',
  headingMedium: 'h1.govuk-heading-m',
  dateOfSentence: 'div[id = "dateOfSentenceDateOfSentence"]',
  offencecode: 'app-fines-mac-offence-details-review-offence-heading-title',

  tableHeadings: 'th.govuk-table__header',

  impositionType: 'td[id ="imposition"]',
  creditor: 'td[id ="creditor"]',
  amountImposed: 'td[id ="amountImposed"]',
  amountPaid: 'td[id ="amountPaid"]',
  balanceRemaining: 'td[id ="balanceRemaining"]',

  totalHeading: 'th[id="totalsHeading"]',
  totalAmountImposed: 'th[id="totalAmountImposed"]',
  totalAmountPaid: 'th[id="totalAmountPaid"]',
  totalBalanceRemaining: 'th[id="totalBalanceRemaining"]',

  GrandtotalAmountImposed: 'div[id ="offencesTotalAmountImposedTotals"]',
  GrandtotalAmountPaid: 'div[id ="offencesTotalAmountPaidTotals"]',
  GrandtotalRemainingBalance: 'div[id = "offencesTotalBalanceRemainingTotals"]',

  //Payment terms
  paymentTerms: 'div[id = "paymentTermsSelectedPaymentTerms"]',
  payByDate: 'div[id = "paymentTermsPayByDate"]',
  requestPaymentCard: 'div[id = "paymentTermsRequestPaymentCard"]',
  hasDaysInDefault: 'div[id = "paymentTermsHasDaysInDefault"]',
  enforcementActions: 'div[id = "paymentTermsHasEnforcementActions"]',

  //account comments and notes
  comments: 'div[id = "accountCommentsAndNotesAccountComment"]',
  accountNotes: 'div[id = "accountCommentsAndNotesAccountNote"]',

  //parent or guardian details
  PGforenames: 'div[id = "parentGuardianDetailsForenames"]',
  PGsurname: 'div[id = "parentGuardianDetailsSurname"]',
  PGAliases: 'div[id = "parentGuardianDetailsAliases"]',
  PGdob: 'div[id = "parentGuardianDetailsDob"]',
  PGnationalInsuranceNumber: 'div[id = "parentGuardianDetailsNationalInsuranceNumber"]',
  PGaddress: 'div[id = "parentGuardianDetailsAddress"]',
  PGvehicleMakeOrModel: 'div[id = "parentGuardianDetailsVehicleMakeOrModel"]',
  PGregistrationNumber: 'div[id = "parentGuardianDetailsRegistrationNumber"]',

  //Company Details
  companyName: 'div[id = "companyDetailsCompanyName"]',
  companyAliases: 'div[id = "companyDetailsAliases"]',
  companyAddress: 'div[id = "companyDetailsAddress"]',

  changeLink: 'a.govuk-link.govuk-link--no-visited-state',
  submitButton: 'button[id = "submitAccountButton"]',
  deleteLink: 'a.govuk-link.govuk-error-colour',

  //review status
  reviewComponent: 'app-fines-mac-review-account-history',
  status: 'strong[id = "status"]',
  reviewHistory: 'h3.govuk-heading-m',
  timeLine: 'div.moj-timeline__item',
  timeLineTitle: 'h2.moj-timeline__title',
  timelineAuthor: 'p.moj-timeline__byline',
  timelineDate: 'p.moj-timeline__date',
};
