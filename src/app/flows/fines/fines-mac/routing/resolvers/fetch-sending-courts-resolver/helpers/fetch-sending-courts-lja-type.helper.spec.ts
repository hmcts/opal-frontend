import { describe, expect, it } from 'vitest';
import { FETCH_SENDING_COURTS_LJA_TYPE_MAP } from '../constants/fetch-sending-courts-lja-type-map.constant';
import { getFetchSendingCourtsLjaTypes } from './fetch-sending-courts-lja-type.helper';

describe('getFetchSendingCourtsLjaTypes', () => {
  it.each([
    {
      originatorType: 'NEW',
      accountType: 'Fine',
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW.Fine,
    },
    {
      originatorType: 'NEW',
      accountType: 'Conditional Caution',
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW['Conditional Caution'],
    },
    {
      originatorType: 'NEW',
      accountType: 'Fixed Penalty',
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.NEW['Fixed Penalty'],
    },
    {
      originatorType: 'TFO',
      accountType: 'Fine',
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.TFO.Fine,
    },
    {
      originatorType: 'TFO',
      accountType: 'Fixed Penalty',
      expectedLjaTypes: FETCH_SENDING_COURTS_LJA_TYPE_MAP.TFO['Fixed Penalty'],
    },
  ])('should map $originatorType + $accountType to lja types', ({ originatorType, accountType, expectedLjaTypes }) => {
    const result = getFetchSendingCourtsLjaTypes(originatorType, accountType);

    expect(result).toEqual(expectedLjaTypes);
    expect(result).not.toBe(expectedLjaTypes);
  });

  it.each([
    { originatorType: null, accountType: 'Fine' },
    { originatorType: 'NEW', accountType: null },
    { originatorType: 'TFO', accountType: 'Conditional Caution' }, // unsupported scenario
    { originatorType: 'UNKNOWN', accountType: 'Fine' },
    { originatorType: 'NEW', accountType: 'UNKNOWN' },
  ])('should return empty list for unsupported or incomplete inputs', ({ originatorType, accountType }) => {
    expect(getFetchSendingCourtsLjaTypes(originatorType, accountType)).toEqual([]);
  });
});
