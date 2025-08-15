import { IFinesSaSearchAccountFormIndividualsFieldErrors } from '../interfaces/fines-sa-search-account-form-individuals-field-errors.interface';

export const FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS: IFinesSaSearchAccountFormIndividualsFieldErrors = {
  fsa_search_account_individuals_last_name: {
    required: {
      message: 'Enter last name',
      priority: 1,
    },
    invalidNamePattern: {
      message: 'Last name must only include letters a to z, hyphens, spaces and apostrophes',
      priority: 2,
    },
    maxlength: {
      message: 'Last name must be 30 characters or fewer',
      priority: 3,
    },
  },
  fsa_search_account_individuals_last_name_exact_match: {},
  fsa_search_account_individuals_first_names: {
    required: {
      message: 'Enter first name',
      priority: 1,
    },
    invalidNamePattern: {
      message: 'First names must only include letters a to z, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'First names must be 20 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_individuals_first_names_exact_match: {},
  fsa_search_account_individuals_include_aliases: {},
  fsa_search_account_individuals_date_of_birth: {
    invalidDateFormat: {
      message: 'Date must be in the format DD/MM/YYYY',
      priority: 1,
    },
    invalidDate: {
      message: 'Enter a valid date',
      priority: 2,
    },
    invalidDateOfBirth: {
      message: 'Date of birth must be in the past',
      priority: 3,
    },
  },
  fsa_search_account_individuals_national_insurance_number: {
    invalidCharacterPattern: {
      message: 'National Insurance number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'National Insurance number must be 9 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_individuals_address_line_1: {
    invalidCharacterPattern: {
      message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_individuals_post_code: {
    invalidCharacterPattern: {
      message: 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'Postcode must be 8 characters or fewer',
      priority: 2,
    },
  },
};
