import { IOpalFinesDefendantAccountSearchParams } from '../interfaces/opal-fines-defendant-account-search-params.interface';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '../constants/opal-fines-defendant-account-search-params-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS } from '../constants/opal-fines-defendant-account-search-params-defendant-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS } from '../constants/opal-fines-defendant-account-search-params-reference-defaults.constant';

export const OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_COMPANY_MOCK: IOpalFinesDefendantAccountSearchParams = {
  ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
  business_unit_ids: [101, 102],
  active_accounts_only: true,
  reference_number: {
    ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
    prosecutor_case_reference: 'PCR123321',
    account_number: 'AC987654',
    organisation: true,
  },
  defendant: {
    ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
    address_line_1: 'Business Park',
    postcode: 'CD3 4EF',
    include_aliases: true,
    organisation_name: 'TechCorp Ltd',
    exact_match_organisation_name: true,
  },
};
