import { OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_CREDITOR_DEFAULT } from '../constants/opal-fines-creditor-account-search-params-creditor-default.constant';
import { IOpalFinesCreditorAccountsSearchParams } from '../interfaces/opal-fines-creditor-accounts-search-params.interface';

export const OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_INDIVIDUAL_MOCK: IOpalFinesCreditorAccountsSearchParams = {
  business_unit_ids: [1],
  active_accounts_only: true,
  account_number: 'ACC123',
  creditor: {
    ...OPAL_FINES_CREDITOR_ACCOUNT_SEARCH_PARAMS_CREDITOR_DEFAULT,
    organisation: false,
    surname: 'Test Surname',
    exact_match_surname: true,
    forenames: 'Test Forename',
    exact_match_forenames: true,
    address_line_1: '123 Test St',
    postcode: '12345',
  },
};
