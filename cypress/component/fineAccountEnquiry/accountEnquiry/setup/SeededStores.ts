import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesAccountStore } from 'src/app/flows/fines/fines-acc/stores/fines-acc.store';
import {
  USER_STATE_MOCK_PERMISSION_BU77,
  USER_STATE_MOCK_NO_PERMISSION,
} from '../../../CommonIntercepts/CommonUserState.mocks';

export const buildSeededAccountStore = (
  accountId: number | string,
  overrides: Partial<ReturnType<FinesAccountStore['getAccountState']>> = {},
) => {
  const store = new FinesAccountStore();
  store.setAccountState({
    account_number: '177A',
    account_id: Number(accountId),
    pg_party_id: null,
    party_id: '77',
    party_type: 'Defendant',
    party_name: 'Mr Anna GRAHAM',
    base_version: '1',
    business_unit_id: '77',
    business_unit_user_id: 'L077AO',
    welsh_speaking: 'No',
    ...overrides,
  });
  return store;
};

export const buildSeededGlobalStore = (
  userState: typeof USER_STATE_MOCK_PERMISSION_BU77 | typeof USER_STATE_MOCK_NO_PERMISSION,
) => {
  const store = new GlobalStore();
  store.setUserState(userState);
  store.setSsoEnabled(false);
  return store;
};
