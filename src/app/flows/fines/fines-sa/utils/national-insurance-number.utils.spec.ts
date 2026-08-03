import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import {
  nationalInsuranceNumberMaxLengthValidator,
  normalizeNationalInsuranceNumber,
} from './national-insurance-number.utils';

describe('national insurance number utils', () => {
  describe('normalizeNationalInsuranceNumber', () => {
    it.each([
      { input: 'AB 12 34 56 C', expected: 'AB123456C' },
      { input: 'ab 12 34 56 c', expected: 'AB123456C' },
      { input: ' QQ123456C ', expected: 'QQ123456C' },
      { input: 'QQ123456C', expected: 'QQ123456C' },
      { input: '', expected: '' },
      { input: null, expected: null },
    ] as const)('normalizes $input to $expected', ({ input, expected }) => {
      expect(normalizeNationalInsuranceNumber(input)).toBe(expected);
    });
  });

  describe('nationalInsuranceNumberMaxLengthValidator', () => {
    it.each(['AB123456C', 'AB 12 34 56 C', 'ab 12 34 56 c', '', null] as const)(
      'returns null for valid value %s',
      (value) => {
        const control = new FormControl<string | null>(value);

        expect(nationalInsuranceNumberMaxLengthValidator(control)).toBeNull();
      },
    );

    it('returns maxlength error when the normalized value is too long', () => {
      const control = new FormControl<string | null>('AB 12 34 56 CD');

      expect(nationalInsuranceNumberMaxLengthValidator(control)).toEqual({
        maxlength: {
          requiredLength: 9,
          actualLength: 10,
        },
      });
    });

    it('ignores non-string values', () => {
      const control = new FormControl<unknown>(1234567890);

      expect(nationalInsuranceNumberMaxLengthValidator(control)).toBeNull();
    });
  });
});
