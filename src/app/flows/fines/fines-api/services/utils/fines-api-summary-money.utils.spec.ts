import { TestBed } from '@angular/core/testing';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { describe, expect, it, vi } from 'vitest';
import { formatSummaryPence, summaryPence } from './fines-api-summary-money.utils';

describe('summaryPence', () => {
  it.each([
    ['0', 0n],
    ['12', 1200n],
    ['12.3', 1230n],
    ['12.34', 1234n],
    ['-12.34', -1234n],
    ['-0.00', 0n],
    [0.29, 29n],
    [12, 1200n],
    ['9007199254740993.01', 900719925474099301n],
  ])('converts %s pounds into exact pence', (amount, expected) => {
    expect(summaryPence(amount)).toBe(expected);
  });
  it.each([
    null,
    undefined,
    true,
    {},
    [],
    '',
    'abc',
    '1.001',
    '£1.00',
    '1,000.00',
    NaN,
    Infinity,
    -Infinity,
    Number.MAX_SAFE_INTEGER,
    -Number.MAX_SAFE_INTEGER,
  ])('rejects invalid or unsafe amount %s', (amount) => {
    expect(() => summaryPence(amount)).toThrow('Invalid monetary value in processing summary');
  });
});

describe('formatSummaryPence', () => {
  it.each([
    [0n, '£0.00'],
    [1n, '£0.01'],
    [-1234n, '-£12.34'],
    [123456n, '£1,234.56'],
    [99999999999999n, '£999,999,999,999.99'],
  ])('formats %s pence using the common service', (pence, expected) => {
    const utils = TestBed.inject(UtilsService);
    const format = vi.spyOn(utils, 'convertToMonetaryString');
    expect(formatSummaryPence(pence, utils)).toBe(expected);
    expect(format).toHaveBeenCalledExactlyOnceWith(Number(pence) / 100);
  });
  it.each([9007199254740992n, -9007199254740992n, 9007199254740991n, -9007199254740991n])(
    'rejects unsafe or non-round-trippable pence %s before formatting',
    (pence) => {
      const utils = { convertToMonetaryString: vi.fn() };
      expect(() => formatSummaryPence(pence, utils)).toThrow('Monetary value exceeds safe formatting precision');
      expect(utils.convertToMonetaryString).not.toHaveBeenCalled();
    },
  );
});
