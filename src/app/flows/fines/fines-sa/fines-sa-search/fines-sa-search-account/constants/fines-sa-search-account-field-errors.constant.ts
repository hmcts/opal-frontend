import { IFinesSaSearchAccountFieldErrors } from '../interfaces/fines-sa-search-account-field-errors.interface';

export const FINES_SA_SEARCH_ACCOUNT_FIELD_ERRORS: IFinesSaSearchAccountFieldErrors = {
  fsa_search_account_business_unit_ids: {},
  fsa_search_account_number: {
    maxlength: {
      message: 'Account number must be 9 characters or fewer',
      priority: 1,
    },
    invalidCharacterPattern: {
      message: 'Account number must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
    invalidFormat: {
      message: 'Enter account number in the correct format such as 12345678 or 12345678A',
      priority: 3,
    },
  },
  fsa_search_account_reference_case_number: {
    invalidCharacterPattern: {
      message: `Reference or case number must only include letters a to z, numbers, hyphens, spaces and apostrophes `,
      priority: 1,
    },
    maxlength: {
      message: 'Reference or case number must be 30 characters or fewer',
      priority: 2,
    },
  },
  fsa_search_account_individuals_search_criteria: {},
  fsa_search_account_companies_search_criteria: {},
  fsa_search_account_minor_creditors_search_criteria: {},
  fsa_search_account_major_creditor_search_criteria: {},
  fsa_search_account_active_accounts_only: {},
};
