import { FINES_MAC_STATUS } from '../constants';

export type FinesMacStatus = (typeof FINES_MAC_STATUS)[keyof typeof FINES_MAC_STATUS];
