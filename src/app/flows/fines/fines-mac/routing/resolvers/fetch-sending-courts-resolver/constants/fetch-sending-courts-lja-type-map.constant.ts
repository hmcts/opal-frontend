import { IFetchSendingCourtsLjaTypeMap } from '../interfaces/fetch-sending-courts-lja-type-map.interface';

const CRWCRT = 'CRWCRT';
const LJA = 'LJA';
const SJCRT = 'SJCRT';
const SCSCRT = 'SCSCRT';
const NICRT = 'NICRT';
const ALL = [CRWCRT, LJA, SJCRT, SCSCRT, NICRT];

/**
 * Maps fines case types and legal jurisdiction act types to their corresponding sending courts.
 *
 * Defines which courts (CRWCRT, LJA, etc.) can be used as sending courts based on:
 * - The case category (NEW or TFO)
 * - The offence type (Fine, Conditional Caution, Fixed Penalty)
 *
 * @example
 * // For NEW cases with Fine offences, use LJA or CRWCRT
 * const courts = FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW.Fine; // [LJA, CRWCRT]
 *
 * // For NEW cases with Conditional Caution, use all available courts
 * const allCourts = FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW['Conditional Caution']; // [...ALL]
 */
export const FETCH_SENDING_COURTS_LJA_TYPE_MAP: IFetchSendingCourtsLjaTypeMap = {
  NEW: {
    Fine: [LJA, CRWCRT],
    'Conditional Caution': [...ALL],
    'Fixed Penalty': [...ALL],
  },
  TFO: {
    Fine: [LJA, CRWCRT],
    'Fixed Penalty': [...ALL],
  },
};
