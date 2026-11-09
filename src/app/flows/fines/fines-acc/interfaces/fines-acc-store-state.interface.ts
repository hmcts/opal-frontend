import { IFinesAccountState } from './fines-acc-state-interface';

export interface IFinesAccStoreState extends IFinesAccountState {
  hasVersionMismatch: boolean;
  hasPaymentHold: boolean;
  successMessage: string | null;
  aprManageReturnUrl: string | null;
}
