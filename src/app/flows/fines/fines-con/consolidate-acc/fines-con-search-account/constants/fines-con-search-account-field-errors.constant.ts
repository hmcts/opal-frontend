import { IFinesConSearchAccountFieldErrors } from '../interfaces/fines-con-search-account-field-errors.interface';

/**
 * Base field error messages for the search account form.
 * These are common errors for quick search and detail search fields.
 */
export const FINES_CON_SEARCH_ACCOUNT_FIELD_ERRORS: IFinesConSearchAccountFieldErrors = {
  fcon_search_account_number: {
    required: {
      message: 'Enter an account number',
      priority: 1,
    },
    invalidFormat: {
      message: 'Enter account number in the correct format such as 12345678 or 12345678A',
      priority: 2,
    },
    maxlength: {
      message: 'Account number must be 9 characters or fewer',
      priority: 3,
    },
  },
  fcon_search_account_individuals_last_name: {
    required: {
      message: 'Enter last name',
      priority: 1,
    },
    lettersWithSpacesPattern: {
      message: 'Last name must only contain letters and spaces',
      priority: 2,
    },
    maxlength: {
      message: 'Last name must be 30 characters or fewer',
      priority: 3,
    },
  },
  fcon_search_account_individuals_first_names: {
    required: {
      message: 'Enter first name',
      priority: 1,
    },
    lettersWithSpacesPattern: {
      message: 'First names must only contain letters and spaces',
      priority: 2,
    },
    maxlength: {
      message: 'First names must be 20 characters or fewer',
      priority: 3,
    },
  },
  fcon_search_account_individuals_date_of_birth: {
    invalidDate: {
      message: 'Enter a valid birth date',
      priority: 1,
    },
    dateFormatPattern: {
      message: 'Date of birth must be in the format DD/MM/YYYY',
      priority: 2,
    },
    dateOfBirthInvalid: {
      message: 'Date of birth must be in the past',
      priority: 3,
    },
  },
  fcon_search_account_individuals_national_insurance_number: {
    alphanumericTextPattern: {
      message: 'National Insurance number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'National Insurance number must be 9 characters or fewer',
      priority: 2,
    },
  },
  fcon_search_account_individuals_address_line_1: {
    alphanumericTextPattern: {
      message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
  },
  fcon_search_account_individuals_post_code: {
    alphanumericTextPattern: {
      message: 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'Postcode must be 8 characters or fewer',
      priority: 2,
    },
  },
  fcon_search_account_companies_name: {
    alphanumericTextPattern: {
      message: 'Company name must only contain alphanumeric characters and spaces',
      priority: 1,
    },
    maxlength: {
      message: 'Company name must be 255 characters or less',
      priority: 2,
    },
  },
  fcon_search_account_companies_reference_number: {
    alphanumericTextPattern: {
      message: 'Reference number must only contain alphanumeric characters and spaces',
      priority: 1,
    },
    maxlength: {
      message: 'Reference number must be 50 characters or less',
      priority: 2,
    },
  },
};
