export const ERROR_MESSAGES: { [key: string]: string } = {
  dateInPast: 'Pay by date is in the past',
  dateInFuture: 'Pay by date is more than 3 years in the future',
  startDateInPast: 'Start date is in the past',
  startDateInFuture: 'Start date is more than 3 years in the future',
  paymentTerms: 'Select payment terms',
  payByDate: 'Enter a pay by date',
  validDate: 'Enter a valid calendar date',
  validDateFormat: 'Pay by date must be in the format DD/MM/YYYY',
  startDate: 'Enter start date',
  instalmentAmount: 'Enter instalment amount',
  validInstalmentAmount: 'Enter valid instalment amount',
  paymentFrequency: 'Select frequency of payment',
  validInstalmentDateFormat: 'Start date must be in the format DD/MM/YYYY',
  lumpSum: 'Enter lump sum',
  validLumpSumAmount: 'Enter valid lump sum amount',
  defaultDays: 'Enter days in default',
  defaultDaysTypeCheck: 'Enter number of days in default',
  futureDate: 'Date must not be in the future',
  futureDateMust: 'Date must be in the future',
  prisonDateFormat: 'Date must be in the format DD/MM/YYYY',
  prisonTypeCheck:
    'Prison and prison number must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes',
  noenfTypeCheck:
    'Reason must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes',
};

export const INSTALLMENT_ERRORS: { [key: string]: string } = {
  startDate: 'Enter start date',
  instalmentAmount: 'Enter instalment amount',
  paymentFrequency: 'Select frequency of payment',
};

export const LUMPSUM_ERRORS: { [key: string]: string } = {
  lumpSum: 'Enter lump sum',
  startDate: 'Enter start date',
  instalmentAmount: 'Enter instalment amount',
  paymentFrequency: 'Select frequency of payment',
};

export const ENFORCEMENT_ERRORS: { [key: string]: string } = {
  validDate: 'Enter a valid calendar date',
  prisonTypeCheck:
    'Prison and prison number must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes',
};
