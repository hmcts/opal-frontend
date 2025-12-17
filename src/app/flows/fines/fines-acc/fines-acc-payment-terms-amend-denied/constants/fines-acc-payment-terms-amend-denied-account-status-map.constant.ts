import { FinesAccAccountStatusCodes } from '../../interfaces/fines-acc-account-status-codes.interface';

/**
 * A mapping of account status codes to their corresponding display strings for denied payment terms amendment page.
 */
export const FINES_ACC_PAYMENT_TERMS_AMEND_DENIED_ACCOUNT_STATUS_MAP: Pick<
  FinesAccAccountStatusCodes,
  'CS' | 'WO' | 'TO' | 'TS' | 'TA'
> = {
  CS: 'been consolidated',
  WO: 'been written-off',
  TO: 'been transferred out',
  TS: 'been transferred out',
  TA: 'been transferred out',
};
