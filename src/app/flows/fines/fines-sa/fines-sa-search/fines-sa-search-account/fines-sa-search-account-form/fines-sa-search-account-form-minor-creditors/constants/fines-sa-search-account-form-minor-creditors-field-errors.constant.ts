import { IFinesSaSearchAccountFormMinorCreditorsFieldErrors } from '../interfaces/fines-sa-search-account-form-minor-creditors-field-errors.interface';

export const FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_FIELD_ERRORS: IFinesSaSearchAccountFormMinorCreditorsFieldErrors =
  {
    fsa_search_account_minor_creditors_minor_creditor_type: {},
    fsa_search_account_minor_creditors_last_name: {
      required: {
        message: 'Enter last name',
        priority: 1,
      },
      requiredIndividualMinorCreditorData: {
        message: 'Enter minor creditor first name, last name, address or postcode',
        priority: 2,
      },
      invalidCharacterPattern: {
        message: 'Last name must only include letters a to z, hyphens, spaces and apostrophes',
        priority: 3,
      },
      maxlength: {
        message: 'Last name must be 30 characters or fewer',
        priority: 4,
      },
    },
    fsa_search_account_minor_creditors_last_name_exact_match: {},
    fsa_search_account_minor_creditors_first_names: {
      invalidCharacterPattern: {
        message: 'First names must only include letters a to z, hyphens, spaces and apostrophes',
        priority: 1,
      },
      maxlength: {
        message: 'First names must be 20 characters or fewer',
        priority: 2,
      },
    },
    fsa_search_account_minor_creditors_first_names_exact_match: {},
    fsa_search_account_minor_creditors_company_name: {
      invalidCharacterPattern: {
        message: 'Company name must only include letters a to z, hyphens, spaces and apostrophes',
        priority: 1,
      },
      maxlength: {
        message: 'Company name must be 50 characters or fewer',
        priority: 2,
      },
    },
    fsa_search_account_minor_creditors_company_name_exact_match: {},
    fsa_search_account_minor_creditors_address_line_1: {
      invalidCharacterPattern: {
        message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
        priority: 1,
      },
      maxlength: {
        message: 'Address line 1 must be 30 characters or fewer',
        priority: 2,
      },
    },
    fsa_search_account_minor_creditors_post_code: {
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
