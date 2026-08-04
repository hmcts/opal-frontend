import { FinesAccountStatusBanners } from '../types/fines-account-status-banners.type';

export const FINES_ACC_ACCOUNT_STATUS_BANNERS: FinesAccountStatusBanners = {
  TA: {
    label: 'Transferred out',
  },
  TS: {
    label: 'Transferred out to Scotland or Northern Ireland',
  },
  CS: {
    heading: 'Account closed',
    label: 'Account consolidated',
  },
  WO: {
    label: 'Account written off',
  },
  TO: {
    label: 'Transfer out in progress',
  },
};
