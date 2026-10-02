import { FinesAccountStatusBanners } from '../types/fines-account-status-banners.type';

export const FINES_ACC_ACCOUNT_STATUS_BANNERS: FinesAccountStatusBanners = {
  TA: {
    heading: null,
    label: 'Transferred out',
  },
  TS: {
    heading: null,
    label: 'Transferred out to Scotland or Northern Ireland',
  },
  CS: {
    heading: 'Account closed',
    label: 'Account consolidated',
  },
  WO: {
    heading: null,
    label: 'Account written off',
  },
  TO: {
    heading: null,
    label: 'Transfer out in progress',
  },
};
