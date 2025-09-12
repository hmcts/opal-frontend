import { IOpalFinesDefendantAccountSearchParams } from '../interfaces/opal-fines-defendant-account-search-params.interface';
import {
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
  OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
} from '../constants/opal-fines-defendant-account-search-params-defaults.constant';

export const OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_INDIVIDUAL_MOCK: IOpalFinesDefendantAccountSearchParams = {
  ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
  business_unit_ids: [101, 102],
  active_accounts_only: true,
  reference_number: {
    ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
    prosecutor_case_reference: 'PCR987654',
    account_number: 'AC123456',
    organisation: false,
  },
  defendant: {
    ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
    surname: 'Smith',
    exact_match_surname: true,
    forenames: 'John',
    exact_match_forenames: false,
    birth_date: '1985-06-15',
    address_line_1: '123 Main Street',
    postcode: 'AB1 2CD',
    national_insurance_number: 'QQ123456C',
    include_aliases: true,
  },
};

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
