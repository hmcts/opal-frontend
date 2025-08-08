import { IOpalFinesDefendantAccountSearchParams } from '../interfaces/opal-fines-defendant-acount-search-params.interface';

export const OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS: IOpalFinesDefendantAccountSearchParams = {
  search_type: null,
  surname: null,
  exact_match_surname: null,
  forename: null,
  exact_match_forenames: null,
  initials: null,
  date_of_birth: null,
  address_line: null,
  postcode: null,
  ni_number: null,
  include_aliases: null,
  organisation_name: null,
  exact_match_organisation_name: null,
  pcr: null,
  account_number: null,
  major_creditor: null,
  till_number: null,
  court: null,
  business_unit_ids: null,
  active_accounts_only: null,
};
