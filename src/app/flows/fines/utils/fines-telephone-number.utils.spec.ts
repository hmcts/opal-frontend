import { describe, expect, it } from 'vitest';
import { stripTelephoneNumberSpaces } from './fines-telephone-number.utils';

describe('stripTelephoneNumberSpaces', () => {
  it('removes whitespace throughout a telephone number while preserving its digits', () => {
    expect(stripTelephoneNumberSpaces(' 07 898\t45\n67 89 ')).toBe('07898456789');
  });

  it('preserves a telephone number that has no whitespace', () => {
    expect(stripTelephoneNumberSpaces('02071234567')).toBe('02071234567');
  });

  it('preserves null and empty values', () => {
    expect(stripTelephoneNumberSpaces(null)).toBeNull();
    expect(stripTelephoneNumberSpaces('')).toBe('');
  });
});
