import { FETCH_SENDING_COURTS_LJA_TYPE_MAP } from '../constants/fetch-sending-courts-lja-type-map.constant';
import {
  TFetchSendingCourtsAccountType,
  TFetchSendingCourtsTfoAccountType,
} from '../interfaces/fetch-sending-courts-lja-type-map.interface';

/**
 * Maps the current originator/account type selection to LJA types for the sending courts lookup.
 *
 * Returns an empty array when the selection is incomplete or unsupported.
 */
export const getFetchSendingCourtsLjaTypes = (originatorType: string | null, accountType: string | null): string[] => {
  if (!originatorType || !accountType) {
    return [];
  }

  if (originatorType === 'NEW') {
    if (!(accountType in FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW)) {
      return [];
    }

    return [...FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW[accountType as TFetchSendingCourtsAccountType]];
  }

  if (originatorType === 'TFO') {
    if (!(accountType in FETCH_SENDING_COURTS_LJA_TYPE_MAP.TFO)) {
      return [];
    }

    return [...FETCH_SENDING_COURTS_LJA_TYPE_MAP.TFO[accountType as TFetchSendingCourtsTfoAccountType]];
  }

  return [];
};
