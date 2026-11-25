import { describe, expect, it } from 'vitest';
import { formatPoundsFromDecimal } from './fines-mci-currency.utils';

describe('formatPoundsFromDecimal', () => {
  it.each([
    ['123456789012345678.12', '£123,456,789,012,345,678.12'],
    ['12.5', '£12.50'],
    ['0', '£0.00'],
    ['-12.34', '-£12.34'],
    ['', '—'],
    ['not an amount', '—'],
  ])('formats %s as %s without losing precision', (amount, expected) => {
    expect(formatPoundsFromDecimal(amount)).toBe(expected);
  });
});
