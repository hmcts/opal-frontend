import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_SEARCH_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  fsa_search_account_number: {
    maxlength: {
      message: 'Account number must be 9 characters or fewer',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Account number must only contain letters or numbers',
      priority: 2,
    },
    invalidFormat: {
      message: 'Enter account number in the correct format such as 12345678 or 12345678A',
      priority: 3,
    },
  },
  fsa_search_account_individuals_search_criteria: {},
  fsa_search_account_individuals_last_name: {
    required: {
      message: 'Enter last name',
      priority: 1,
    },
    singleAsciiCharacters: {
      message:
        'Last Name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
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
    singleAsciiCharacters: {
      message:
        'First Names must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
      priority: 1,
    },
    maxlength: {
      message: 'First names must be 20 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_individuals_first_names_exact_match: {},
  fsa_search_account_individuals_include_aliases: {},
  fsa_search_account_companies_search_criteria: {},
  fsa_search_account_companies_company_name: {
    required: {
      message: 'Enter company name',
      priority: 1,
    },
    singleAsciiCharacters: {
      message:
        'Company Name must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)',
      priority: 1,
    },
    maxlength: {
      message: 'Company name must be 50 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_companies_company_name_exact_match: {},
  fsa_search_account_companies_include_aliases: {},
};
