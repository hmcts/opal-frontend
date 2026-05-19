import { FinesAccAccountStatusCodes } from '../../interfaces/fines-acc-account-status-codes.interface';

export const FINES_ACC_ENF_ACTION_DENIED_ACCOUNT_STATUS_MAP: Pick<
  FinesAccAccountStatusCodes,
  'CS' | 'WO' | 'TO' | 'TS' | 'TA'
> = {
  CS: 'Consolidated',
  WO: 'Written off',
  TO: 'Transferred out',
  TS: 'TFO Out Acknowledged',
  TA: 'TFO to be Acknowledged',
};
