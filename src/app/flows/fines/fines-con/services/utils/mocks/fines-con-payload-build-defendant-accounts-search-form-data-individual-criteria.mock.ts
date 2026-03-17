import { IFinesConSearchAccountState } from '../../../consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { FINES_CON_SEARCH_ACCOUNT_STATE } from '../../../consolidate-acc/fines-con-search-account/constants/fines-con-search-account-state.constant';

export const FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_INDIVIDUAL_CRITERIA_MOCK: IFinesConSearchAccountState =
  {
    ...structuredClone(FINES_CON_SEARCH_ACCOUNT_STATE),
    fcon_search_account_individuals_search_criteria: {
      ...FINES_CON_SEARCH_ACCOUNT_STATE.fcon_search_account_individuals_search_criteria!,
      fcon_search_account_individuals_last_name: 'Smith',
      fcon_search_account_individuals_first_names: 'Jane',
      fcon_search_account_individuals_include_aliases: true,
      fcon_search_account_individuals_date_of_birth: '1990-01-01',
      fcon_search_account_individuals_address_line_1: '1 Main Street',
      fcon_search_account_individuals_post_code: 'AB1 2CD',
    },
  };
