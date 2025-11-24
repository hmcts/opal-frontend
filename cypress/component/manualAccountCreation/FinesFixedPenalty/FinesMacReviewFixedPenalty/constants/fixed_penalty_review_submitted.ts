export const DOM_ELEMENTS = {
  // Main component elements
  pageHeading: 'h1.govuk-heading-l',
  summaryCards: '.govuk-summary-card',
  summaryCardTitles: '.govuk-summary-card__title',

  // Account Details section
  businessUnit: '[summaryListRowId="businessUnit"] dd',
  accountType: '[summaryListRowId="accountType"] dd',
  defendantType: '[summaryListRowId="defendantType"] dd',

  // Court Details section
  issuingAuthority: '[summaryListRowId="issuingAuthority"] dd',
  enforcementCourt: '[summaryListRowId="enforcementCourt"] dd',

  // Personal Details section
  title: '[summaryListRowId="title"] dd',
  forenames: '[summaryListRowId="forenames"] dd',
  surname: '[summaryListRowId="surname"] dd',
  dateOfBirth: '[summaryListRowId="dob"] dd',
  address: '[summaryListRowId="address"] dd',

  // Company Details section (for company defendant type)
  companyName: '[summaryListRowId="companyName"] dd',
  companyAddress: '[summaryListRowId="address"] dd',

  // Fixed Penalty Offence Details section
  noticeNumber: '[summaryListRowId="noticeNumber"] dd',
  offenceType: '[summaryListRowId="offenceType"] dd',
  registrationNumber: '[summaryListRowId="registrationNumber"] dd',
  drivingLicenceNumber: '[summaryListRowId="drivingLicenceNumber"] dd',
  noticeDate: '[summaryListRowId="noticeDate"] dd',
  dateOfOffence: '[summaryListRowId="dateOfOffence"] dd',
  offenceCode: '[summaryListRowId="offenceCode"] dd',
  timeOfOffence: '[summaryListRowId="timeOfOffence"] dd',
  placeOfOffence: '[summaryListRowId="placeOfOffence"] dd',
  amountImposed: '[summaryListRowId="amountImposed"] dd',

  // Comments and Notes section
  accountComment: '[summaryListRowId="accountComment"] dd',
  accountNote: '[summaryListRowId="accountNote"] dd',
};
