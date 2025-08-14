import { IFinesSaSearchAccountFormCompaniesFieldErrors } from '../interfaces/fines-sa-search-account-form-companies-field-errors.interface';

export const FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS: IFinesSaSearchAccountFormCompaniesFieldErrors = {
  fsa_search_account_companies_company_name: {
    lettersWithSpacesPattern: {
      message: 'Company name must only contain letters',
      priority: 1,
    },
    maxlength: {
      message: 'Company name must be 50 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_companies_company_name_exact_match: {},
  fsa_search_account_companies_include_aliases: {},
  fsa_search_account_companies_address_line_1: {
    alphanumericTextPattern: {
      message: 'Address line 1 must only contain letters or numbers',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_companies_post_code: {
    alphanumericTextPattern: {
      message: 'Post code must only contain letters or numbers',
      priority: 1,
    },
    maxlength: {
      message: 'Post code must be 8 characters or fewer',
      priority: 2,
    },
  },
};
