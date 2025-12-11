/**
 * Error messages for account enquiries view details functionality.
 * Used for validating error messages in defendant details forms.
 */

// Error messages - Individual/Paying Defendant
export const ERROR_MESSAGES = {
  // Required field errors - Individual
  REQUIRED_TITLE: 'Select a title',
  REQUIRED_FORENAMES: "Enter defendant's first name(s)",
  REQUIRED_SURNAME: "Enter defendant's last name",
  REQUIRED_ADDRESS_LINE_1: 'Enter address line 1, typically the building and street',

  // Required field errors - Employer (conditional)
  REQUIRED_EMPLOYER_NAME: 'Enter employer name',
  REQUIRED_EMPLOYER_REFERENCE_OR_NI: 'Enter employee reference or National Insurance number',
  REQUIRED_EMPLOYER_ADDRESS_LINE_1: 'Enter address line 1, typically the building and street',

  // Required field errors - Alias
  REQUIRED_ALIAS_FORENAMES: (n: number) => `Enter alias ${n} first name(s)`,
  REQUIRED_ALIAS_SURNAME: (n: number) => `Enter alias ${n} last name`,

  // Format validation errors
  FORMAT_DOB_INVALID: 'Enter date of birth in the format DD/MM/YYYY',
  FORMAT_DOB_FUTURE: 'Enter a valid date of birth in the past',
  FORMAT_NI_NUMBER: 'Enter a National Insurance number in the format AANNNNNNA',

  // Email format errors
  FORMAT_EMAIL_PRIMARY: 'Enter primary email address in the correct format, like name@example.com',
  FORMAT_EMAIL_SECONDARY: 'Enter secondary email address in the correct format, like name@example.com',
  FORMAT_EMAIL_EMPLOYER: 'Enter employer email address in the correct format, like name@example.com',

  // Telephone format errors
  FORMAT_PHONE_HOME: 'Enter a valid home telephone number, like 01632 960 001',
  FORMAT_PHONE_WORK: 'Enter a valid work telephone number, like 01632 960 001 or 07700 900 982',
  FORMAT_PHONE_MOBILE: 'Enter a valid mobile telephone number, like 07700 900 982',
  FORMAT_PHONE_EMPLOYER:
    'Enter a valid employer telephone number in the correct format, like 07700 900 982 or 01263 766122',

  // Max length errors - Individual
  MAX_LENGTH_FORENAMES: "Defendant's first name(s) must be 20 characters or fewer",
  MAX_LENGTH_SURNAME: "Defendant's last name must be 30 characters or fewer",
  MAX_LENGTH_ALIAS_FORENAMES: 'Alias 1 first name(s) must be 20 characters or fewer',
  MAX_LENGTH_ALIAS_SURNAME: 'Alias 1 last name must be 30 characters or fewer',
  MAX_LENGTH_NI_NUMBER: 'Enter a National Insurance number in the format AANNNNNNA',
  MAX_LENGTH_ADDRESS_LINE_1: 'Address line 1 must be 30 characters or fewer',
  MAX_LENGTH_ADDRESS_LINE_2: 'Address line 2 must be 30 characters or fewer',
  MAX_LENGTH_ADDRESS_LINE_3: 'Address line 3 must be 16 characters or fewer',
  MAX_LENGTH_POSTCODE: 'Postcode must be 8 characters or fewer',
  MAX_LENGTH_EMAIL_PRIMARY: 'Primary email address must be 76 characters or fewer',
  MAX_LENGTH_EMAIL_SECONDARY: 'Secondary email address must be 76 characters or fewer',
  MAX_LENGTH_VEHICLE_MAKE: 'Make and model must be 30 characters or fewer',
  MAX_LENGTH_VEHICLE_REGISTRATION: 'Vehicle registration must be 11 characters or fewer',
  MAX_LENGTH_EMPLOYER_NAME: 'Employer name must be 50 characters or fewer',
  MAX_LENGTH_EMPLOYER_REFERENCE: 'Employee reference must be 20 characters or fewer',
  MAX_LENGTH_EMPLOYER_EMAIL: 'Employer email address must be 76 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_1: 'Address line 1 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_2: 'Address line 2 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_3: 'Address line 3 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_4: 'Address line 4 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_5: 'Address line 5 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_POSTCODE: 'Postcode must be 8 characters or fewer',

  // Data type errors - Alphabetical
  DATA_TYPE_FORENAMES: "Defendant's first name(s) must only contain letters",
  DATA_TYPE_SURNAME: "Defendant's last name must only contain letters",
  DATA_TYPE_ALIAS_FORENAMES: 'Alias 1 first name(s) must only contain letters',
  DATA_TYPE_ALIAS_SURNAME: 'Alias 1 last name must only contain letters',

  // Data type errors - Alphanumeric
  DATA_TYPE_ADDRESS_LINE_1: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_ADDRESS_LINE_2: 'Address line 2 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_ADDRESS_LINE_3: 'Address line 3 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_POSTCODE: 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_VEHICLE_MAKE:
    'Vehicle make and model must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_VEHICLE_REGISTRATION:
    'Vehicle registration must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_NAME: 'Employer name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_REFERENCE:
    'Employer reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_1:
    'Employer address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_2:
    'Employer address line 2 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_3:
    'Employer address line 3 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_4:
    'Employer address line 4 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_5:
    'Employer address line 5 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_POSTCODE:
    'Employer postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',

  // Company errors
  REQUIRED_COMPANY_NAME: 'Enter company name',
  REQUIRED_COMPANY_ALIAS: (n: number) => `Enter alias ${n} company name`,
  MAX_LENGTH_COMPANY_NAME: 'Company name must be 50 characters or fewer',
  MAX_LENGTH_COMPANY_ALIAS: 'Alias 1 company name must be 20 characters or fewer',
  MAX_LENGTH_COMPANY_ALIAS_2: 'Alias 2 company name must be 20 characters or fewer',
  DATA_TYPE_COMPANY_NAME:
    'Company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
  DATA_TYPE_COMPANY_ALIAS_1:
    'Alias 1 company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
  DATA_TYPE_COMPANY_ALIAS_2:
    'Alias 2 company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
};

// Parent/Guardian specific error messages
export const PARENT_GUARDIAN_ERROR_MESSAGES = {
  REQUIRED_FORENAMES: 'Enter parent or guardian first name(s)',
  REQUIRED_SURNAME: 'Enter parent or guardian last name',
  REQUIRED_ADDRESS_LINE_1: 'Enter address line 1, typically the building and street',

  MAX_LENGTH_FORENAMES: 'Parent or guardian first name(s) must be 20 characters or fewer',
  MAX_LENGTH_SURNAME: 'Parent or guardian last name must be 30 characters or fewer',

  DATA_TYPE_FORENAMES: 'Parent or guardian first name(s) must only contain letters',
  DATA_TYPE_SURNAME: 'Parent or guardian last name must only contain letters',
};

// Pre-defined error message arrays for common test scenarios
export const INDIVIDUAL_REQUIRED_MESSAGES = [
  ERROR_MESSAGES.REQUIRED_TITLE,
  ERROR_MESSAGES.REQUIRED_FORENAMES,
  ERROR_MESSAGES.REQUIRED_SURNAME,
  ERROR_MESSAGES.REQUIRED_ADDRESS_LINE_1,
];

export const EMPLOYER_REQUIRED_MESSAGES = [
  ERROR_MESSAGES.REQUIRED_EMPLOYER_REFERENCE_OR_NI,
  ERROR_MESSAGES.REQUIRED_ADDRESS_LINE_1,
];

export const INDIVIDUAL_MAX_LENGTH_ERRORS = [
  ERROR_MESSAGES.MAX_LENGTH_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_NI_NUMBER,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_POSTCODE,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_PRIMARY,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_SECONDARY,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_MAKE,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_REGISTRATION,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_NAME,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_REFERENCE,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_EMAIL,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_4,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_5,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_POSTCODE,
];

export const INDIVIDUAL_ALPHABETICAL_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_FORENAMES,
  ERROR_MESSAGES.DATA_TYPE_SURNAME,
  ERROR_MESSAGES.DATA_TYPE_ALIAS_FORENAMES,
  ERROR_MESSAGES.DATA_TYPE_ALIAS_SURNAME,
];

export const INDIVIDUAL_ALPHANUMERIC_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_1,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_2,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_3,
  ERROR_MESSAGES.DATA_TYPE_POSTCODE,
  ERROR_MESSAGES.DATA_TYPE_VEHICLE_MAKE,
  ERROR_MESSAGES.DATA_TYPE_VEHICLE_REGISTRATION,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_NAME,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_REFERENCE,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_1,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_2,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_3,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_4,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_5,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_POSTCODE,
];

export const INDIVIDUAL_ALL_DATA_TYPE_ERRORS = [...INDIVIDUAL_ALPHABETICAL_ERRORS, ...INDIVIDUAL_ALPHANUMERIC_ERRORS];

// Non-paying defendant error messages (subset of individual)
export const NON_PAYING_MAX_LENGTH_ERRORS = [
  ERROR_MESSAGES.MAX_LENGTH_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_NI_NUMBER,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_POSTCODE,
];

export const NON_PAYING_ALPHANUMERIC_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_1,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_2,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_3,
  ERROR_MESSAGES.DATA_TYPE_POSTCODE,
];

export const NON_PAYING_ALL_DATA_TYPE_ERRORS = [...INDIVIDUAL_ALPHABETICAL_ERRORS, ...NON_PAYING_ALPHANUMERIC_ERRORS];

// Company error messages
export const COMPANY_MAX_LENGTH_ERRORS = [
  ERROR_MESSAGES.MAX_LENGTH_COMPANY_NAME,
  ERROR_MESSAGES.MAX_LENGTH_COMPANY_ALIAS,
  ERROR_MESSAGES.MAX_LENGTH_COMPANY_ALIAS_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_POSTCODE,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_PRIMARY,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_SECONDARY,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_MAKE,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_REGISTRATION,
];

export const COMPANY_ALPHABETICAL_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_COMPANY_NAME,
  ERROR_MESSAGES.DATA_TYPE_COMPANY_ALIAS_1,
  ERROR_MESSAGES.DATA_TYPE_COMPANY_ALIAS_2,
];

export const COMPANY_ALPHANUMERIC_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_1,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_2,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_3,
  ERROR_MESSAGES.DATA_TYPE_POSTCODE,
  ERROR_MESSAGES.DATA_TYPE_VEHICLE_MAKE,
  ERROR_MESSAGES.DATA_TYPE_VEHICLE_REGISTRATION,
];

export const COMPANY_ALL_DATA_TYPE_ERRORS = [...COMPANY_ALPHABETICAL_ERRORS, ...COMPANY_ALPHANUMERIC_ERRORS];

// Parent/Guardian error message arrays
export const PARENT_GUARDIAN_REQUIRED_MESSAGES = [
  PARENT_GUARDIAN_ERROR_MESSAGES.REQUIRED_FORENAMES,
  PARENT_GUARDIAN_ERROR_MESSAGES.REQUIRED_SURNAME,
  PARENT_GUARDIAN_ERROR_MESSAGES.REQUIRED_ADDRESS_LINE_1,
];

export const PARENT_GUARDIAN_MAX_LENGTH_ERRORS = [
  PARENT_GUARDIAN_ERROR_MESSAGES.MAX_LENGTH_FORENAMES,
  PARENT_GUARDIAN_ERROR_MESSAGES.MAX_LENGTH_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_NI_NUMBER,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_POSTCODE,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_PRIMARY,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_SECONDARY,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_MAKE,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_REGISTRATION,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_NAME,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_REFERENCE,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_EMAIL,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_4,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_5,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_POSTCODE,
];

// Parent/Guardian alphabetical field errors (for data type validation)
const PARENT_GUARDIAN_ALPHABETICAL_ERRORS = [
  PARENT_GUARDIAN_ERROR_MESSAGES.DATA_TYPE_FORENAMES,
  PARENT_GUARDIAN_ERROR_MESSAGES.DATA_TYPE_SURNAME,
  ERROR_MESSAGES.DATA_TYPE_ALIAS_FORENAMES,
  ERROR_MESSAGES.DATA_TYPE_ALIAS_SURNAME,
];

// Parent/Guardian uses same alphanumeric errors as individual
const PARENT_GUARDIAN_ALPHANUMERIC_ERRORS = INDIVIDUAL_ALPHANUMERIC_ERRORS;

export const PARENT_GUARDIAN_ALL_DATA_TYPE_ERRORS = [
  ...PARENT_GUARDIAN_ALPHABETICAL_ERRORS,
  ...PARENT_GUARDIAN_ALPHANUMERIC_ERRORS,
];

// Legacy exports for backward compatibility
export const coreRequiredMessages = PARENT_GUARDIAN_REQUIRED_MESSAGES;
export const expectedErrors = PARENT_GUARDIAN_MAX_LENGTH_ERRORS;
export const alphabeticalFieldErrors = PARENT_GUARDIAN_ALPHABETICAL_ERRORS;
export const alphanumericFieldErrors = PARENT_GUARDIAN_ALPHANUMERIC_ERRORS;
export const allExpectedErrors = PARENT_GUARDIAN_ALL_DATA_TYPE_ERRORS;
