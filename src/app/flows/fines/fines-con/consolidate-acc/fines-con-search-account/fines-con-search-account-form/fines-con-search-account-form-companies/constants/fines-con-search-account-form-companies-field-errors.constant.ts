import { IFinesConSearchAccountFormCompaniesFieldErrors } from '../interfaces/fines-con-search-account-form-companies-field-errors.interface';

/**
 * Field error messages specific to the Companies search form.
 */
export const FINES_CON_SEARCH_ACCOUNT_FORM_COMPANIES_FIELD_ERRORS: IFinesConSearchAccountFormCompaniesFieldErrors = {
  fcon_search_account_companies_company_name: {
    required: {
      message: 'Enter company name',
      priority: 1,
    },
    lettersWithSpacesHyphensApostrophesPattern: {
      message: 'Company name must only include letters a to z, hyphens, spaces and apostrophes',
      priority: 2,
    },
    maxlength: {
      message: 'Company name must be 50 characters or fewer',
      priority: 3,
    },
  },
  fcon_search_account_companies_company_name_exact_match: {},
  fcon_search_account_companies_include_aliases: {},
  fcon_search_account_companies_address_line_1: {
    alphanumericTextPattern: {
      message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: {
      message: 'Address line 1 must be 30 characters or fewer',
      priority: 2,
    },
  },
  fcon_search_account_companies_post_code: {
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
