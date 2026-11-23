import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { normalizeSortCode, sortCodeValidator } from './sort-code.validator';

describe('sortCodeValidator', () => {
  it.each(['1234', '12345', '1234567', '12345A', '12-34-5', '12 34 567', '12/34/56', '12.34.56', ' -- '])(
    'should reject invalid sort code %s',
    (value) => {
      expect(sortCodeValidator(new FormControl(value))).toEqual({ invalidSortCode: true });
    },
  );

  it.each(['123456', '12-34-56', '12 34 56', '123 456', '12  34  56', '12--34  56', ' 123456 ', '00-12 34'])(
    'should accept sort code %s',
    (value) => {
      expect(sortCodeValidator(new FormControl(value))).toBeNull();
    },
  );

  it.each([null, ''])('should leave empty value %s to the required validator', (value) => {
    expect(sortCodeValidator(new FormControl(value))).toBeNull();
  });
});

describe('normalizeSortCode', () => {
  it.each(['123456', '12-34-56', '12 34 56', '123 456', '12  34  56', '12--34  56', ' 123456 '])(
    'should normalize %s to six digits',
    (value) => {
      expect(normalizeSortCode(value)).toBe('123456');
    },
  );

  it('should preserve leading zeroes', () => {
    expect(normalizeSortCode('00-12 34')).toBe('001234');
  });

  it.each([null, undefined])('should return null when the sort code is %s', (value) => {
    expect(normalizeSortCode(value)).toBeNull();
  });
});
