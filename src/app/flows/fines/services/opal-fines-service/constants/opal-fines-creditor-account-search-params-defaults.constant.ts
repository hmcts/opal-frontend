import {
  IOpalFinesCreditorAccountsSearchParams,
  IOpalFinesCreditorAccountsSearchParamsCreditor,
} from '../interfaces/opal-fines-creditor-accounts-search-params.interface';

export const OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_DEFAULTS: IOpalFinesCreditorAccountsSearchParams = {
  business_unit_ids: [65, 66, 73, 77, 80, 78],
  active_accounts_only: null,
  account_number: null,
  creditor: null,
};

export const OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_CREDITOR_DEFAULT: IOpalFinesCreditorAccountsSearchParamsCreditor =
  {
    organisation: null,
    organisation_name: null,
    exact_match_organisation_name: null,
    surname: null,
    exact_match_surname: null,
    forenames: null,
    exact_match_forenames: null,
    address_line_1: null,
    postcode: null,
  };
