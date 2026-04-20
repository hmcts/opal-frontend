import { IFinesConSearchAccountState } from '../../../consolidate-acc/fines-con-search-account/interfaces/fines-con-search-account-state.interface';
import { FINES_CON_SEARCH_ACCOUNT_STATE } from '../../../consolidate-acc/fines-con-search-account/constants/fines-con-search-account-state.constant';

export const FINES_CON_PAYLOAD_BUILD_DEFENDANT_ACCOUNTS_SEARCH_FORM_DATA_ACCOUNT_NUMBER_MOCK: IFinesConSearchAccountState =
  {
    ...structuredClone(FINES_CON_SEARCH_ACCOUNT_STATE),
    fcon_search_account_number: 'ACC123',
  };
