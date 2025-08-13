import {
  IOpalFinesCreditorAccountsSearchParams,
  IMinorCreditorOrganisationSearch,
  IMinorCreditorIndividualSearch,
} from '../interfaces/opal-fines-creditor-accounts-search-params.interface';

export const OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_DEFAULTS: IOpalFinesCreditorAccountsSearchParams = {
  business_unit_ids: null,
  active_accounts_only: null,
  account_number: null,
  creditor: null,
};

export const OPAL_FINES_CREDITOR_ORGANISATION_SEARCH_DEFAULTS: IMinorCreditorOrganisationSearch = {
  organisation: true,
  organisation_name: null,
  exact_match_organisation_name: null,
  address_line_1: null,
  postcode: null,
};

export const OPAL_FINES_CREDITOR_INDIVIDUAL_SEARCH_DEFAULTS: IMinorCreditorIndividualSearch = {
  organisation: false,
  surname: null,
  exact_match_surname: null,
  forenames: null,
  exact_match_forenames: null,
  address_line_1: null,
  postcode: null,
};
