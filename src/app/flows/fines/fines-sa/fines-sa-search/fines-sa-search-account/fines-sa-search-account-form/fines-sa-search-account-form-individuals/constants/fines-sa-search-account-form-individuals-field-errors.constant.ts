import { IFinesSaSearchAccountFormIndividualsFieldErrors } from '../interfaces/fines-sa-search-account-form-individuals-field-errors.interface';

export const FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS: IFinesSaSearchAccountFormIndividualsFieldErrors = {
  fsa_search_account_individuals_last_name: {
    required: {
      message: 'Enter last name',
      priority: 1,
    },
    lettersWithSpacesPattern: {
      message: 'Last name must only contain letters',
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
    lettersWithSpacesPattern: {
      message: 'First names must only contain letters',
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
    alphanumericTextPattern: {
      message: 'National Insurance number must only contain letters or numbers',
      priority: 1,
    },
    maxlength: {
      message: 'National Insurance number must be 9 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_individuals_address_line_1: {
    singleAsciiCharacters: {
      message:
        'Address line 1 must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_individuals_post_code: {
    alphanumericTextPattern: {
      message: 'Postcode must only contain letters or numbers',
      priority: 1,
    },
    maxlength: {
      message: 'Postcode must be 8 characters or fewer',
      priority: 2,
    },
  },
};
