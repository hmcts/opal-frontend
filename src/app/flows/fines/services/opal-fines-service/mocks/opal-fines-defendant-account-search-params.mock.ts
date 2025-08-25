import { IOpalFinesDefendantAccountSearchParams } from '../interfaces/opal-fines-defendant-account-search-params.interface';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '../constants/opal-fines-defendant-account-search-params-defaults.constant';

export const OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_INDIVIDUAL_MOCK: IOpalFinesDefendantAccountSearchParams = {
  ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
  search_type: 'individual',
  surname: 'Smith',
  exact_match_surname: true,
  forename: 'John',
  exact_match_forenames: false,
  initials: 'JS',
  date_of_birth: '1985-06-15',
  address_line: '123 Main Street',
  postcode: 'AB1 2CD',
  ni_number: 'QQ123456C',
  include_aliases: true,
  pcr: 'PCR987654',
  account_number: 'AC123456',
  court: 'Highbury',
  business_unit_ids: [101, 102],
  active_accounts_only: true,
};

export const OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_COMPANY_MOCK: IOpalFinesDefendantAccountSearchParams = {
  ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
  search_type: 'company',
  address_line: 'Business Park',
  postcode: 'CD3 4EF',
  include_aliases: true,
  organisation_name: 'TechCorp Ltd',
  exact_match_organisation_name: true,
  pcr: 'PCR123321',
  account_number: 'AC987654',
  court: 'Central Court',
  business_unit_ids: [103],
  active_accounts_only: false,
};
