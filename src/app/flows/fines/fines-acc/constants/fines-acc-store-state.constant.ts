import { IFinesAccStoreState } from '../interfaces/fines-acc-store-state.interface';
import { FINES_ACCOUNT_STATE } from './fines-acc-state.constant';

export const FINES_ACC_STORE_STATE: IFinesAccStoreState = {
  ...FINES_ACCOUNT_STATE,
  hasVersionMismatch: false,
  hasPaymentHold: false,
  successMessage: null,
  aprManageReturnUrl: null,
};
