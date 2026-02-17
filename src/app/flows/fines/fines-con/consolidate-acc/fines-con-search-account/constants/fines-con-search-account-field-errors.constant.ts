import { IFinesConSearchAccountFieldErrors } from '../interfaces/fines-con-search-account-field-errors.interface';

/**
 * Base field error messages for the search account form.
 * Includes errors for common search fields and nested defendant-type-specific search criteria.
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
  fcon_search_account_national_insurance_number: {
    nationalInsuranceNumberPattern: {
      message: 'Enter a National Insurance number in the format AANNNNNNA',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'National Insurance number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
    maxlength: {
      message: 'National Insurance number must be 9 characters or fewer',
      priority: 3,
    },
  },
  fcon_search_account_individuals_search_criteria: {},
};
