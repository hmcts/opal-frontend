import {
  IOpalFinesDefendantAccountSearchParams,
  IOpalFinesDefendantAccountSearchParamsDefendant,
  IOpalFinesDefendantAccountSearchParamsReference,
} from '../interfaces/opal-fines-defendant-account-search-params.interface';

export const OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS: IOpalFinesDefendantAccountSearchParamsDefendant =
  {
    include_aliases: null,
    organisation: null,
    address_line_1: null,
    postcode: null,
    organisation_name: null,
    exact_match_organisation_name: null,
    surname: null,
    exact_match_surname: null,
    forenames: null,
    exact_match_forenames: null,
    birth_date: null,
    national_insurance_number: null,
  };

export const OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS: IOpalFinesDefendantAccountSearchParamsReference =
  {
    account_number: null,
    prosecutor_case_reference: null,
    organisation: false,
  };

export const OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS: IOpalFinesDefendantAccountSearchParams = {
  active_accounts_only: false,
  business_unit_ids: [65, 66, 73, 77, 80, 78],
  reference_number: null,
  defendant: null,
};
