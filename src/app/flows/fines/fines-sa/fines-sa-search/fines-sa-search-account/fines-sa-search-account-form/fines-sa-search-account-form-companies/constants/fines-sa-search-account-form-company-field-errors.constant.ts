import { IFinesSaSearchAccountFormCompanyFieldErrors } from '../interfaces/fines-sa-search-account-form-company-field-errors.interface';

export const FINES_SA_SEARCH_ACCOUNT_FORM_COMPANY_FIELD_ERRORS: IFinesSaSearchAccountFormCompanyFieldErrors = {
  fsa_search_account_company_company_name: {
    invalidCharacterPattern: {
      message: 'Company name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'Company name must be 50 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_company_company_name_exact_match: {},
  fsa_search_account_company_include_aliases: {},
  fsa_search_account_company_address_line_1: {
    invalidCharacterPattern: {
      message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_company_post_code: {
    invalidCharacterPattern: {
      message: 'Post code must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'Post code must be 8 characters or fewer',
      priority: 2,
    },
  },
};
