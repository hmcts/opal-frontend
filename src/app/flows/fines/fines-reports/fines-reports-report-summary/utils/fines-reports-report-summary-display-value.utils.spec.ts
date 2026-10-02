import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import {
  getCriteriaDateDisplayValue,
  isUnusedOptionalValue,
  mapCurrencyValue,
  mapDisplayText,
} from './fines-reports-report-summary-display-value.utils';

const dateService = {
  getFromIso: (value: string) => DateTime.fromISO(value),
  toFormat: (value: DateTime, format: string) => value.toFormat(format),
} as DateService;

describe('report summary display values', () => {
  it.each([null, undefined, '', []])('omits an unused optional value: %j', (value) => {
    expect(isUnusedOptionalValue(value)).toBe(true);
  });

  it.each([0, false, '0', ['Adult'], { message: 'Failed' }])('retains a supplied optional value: %j', (value) => {
    expect(isUnusedOptionalValue(value)).toBe(false);
  });

  it.each([
    { value: true, expected: 'TRUE' },
    { value: false, expected: 'FALSE' },
    { value: 0, expected: '0' },
    { value: 125.5, expected: '125.5' },
    { value: 'Adult', expected: 'Adult' },
    { value: null, expected: '' },
    { value: undefined, expected: '' },
    { value: { message: 'Failed', code: 500 }, expected: '{"message":"Failed","code":500}' },
    { value: [], expected: '' },
    { value: ['Adult', 0, false, null, { code: 'BWTD' }], expected: 'Adult, 0, false, null, {"code":"BWTD"}' },
  ])('formats $value as $expected without default object stringification', ({ value, expected }) => {
    expect(mapDisplayText(value)).toBe(expected);
  });

  it.each([
    { value: ' £1,234.50 ', expected: 1234.5 },
    { value: 0, expected: 0 },
    { value: '-12.50', expected: -12.5 },
    { value: 'not available', expected: 'not available' },
  ])('preserves money value $value as $expected', ({ value, expected }) => {
    expect(mapCurrencyValue(value)).toBe(expected);
  });

  it.each([
    { value: '2006-05-01', expected: '01 May 2006' },
    { value: ' invalid-date ', expected: 'invalid-date' },
    { value: '', expected: '' },
    { value: '  ', expected: '' },
    { value: null, expected: '' },
    { value: undefined, expected: '' },
  ])('formats date $value as $expected', ({ value, expected }) => {
    expect(getCriteriaDateDisplayValue(value, dateService)).toBe(expected);
  });
});
