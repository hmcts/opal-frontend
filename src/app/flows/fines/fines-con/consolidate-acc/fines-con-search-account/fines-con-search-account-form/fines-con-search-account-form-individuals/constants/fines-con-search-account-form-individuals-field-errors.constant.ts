import { IFinesConSearchAccountFormIndividualsFieldErrors } from '../interfaces/fines-con-search-account-form-individuals-field-errors.interface';

/**
 * Field error messages specific to the Individuals search form.
 */
export const FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_FIELD_ERRORS: IFinesConSearchAccountFormIndividualsFieldErrors =
  {
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
    fcon_search_account_individuals_last_name_exact_match: {},
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
    fcon_search_account_individuals_first_names_exact_match: {},
    fcon_search_account_individuals_include_aliases: {},
    fcon_search_account_individuals_date_of_birth: {
      invalidDateFormat: {
        message: 'Date of birth must be in the format DD/MM/YYYY',
        priority: 1,
      },
      invalidDate: {
        message: 'Enter a valid birth date',
        priority: 2,
      },
      invalidDateOfBirth: {
        message: 'Date of birth must be in the past',
        priority: 3,
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
  };
