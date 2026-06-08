import { IFinesAccountState } from '../../interfaces/fines-acc-state-interface';
import { FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK } from './fines-acc-enf-action-add-account-state.mock';

export const FINES_ACC_ENF_ACTION_ADD_NON_WELSH_ACCOUNT_STATE_MOCK: IFinesAccountState = {
  ...FINES_ACC_ENF_ACTION_ADD_ACCOUNT_STATE_MOCK,
  welsh_speaking: 'N',
};
