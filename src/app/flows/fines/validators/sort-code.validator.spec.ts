import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { normalizeSortCode, sortCodeValidator } from './sort-code.validator';

describe('sortCodeValidator', () => {
  it('should return invalidSortCode when the input does not match a supported format', () => {
    expect(sortCodeValidator(new FormControl('12--34  56'))).toEqual({ invalidSortCode: true });
  });

  it.each(['12345', '1234567', '12345A', '12--34  56'])('should reject invalid sort code %s', (value) => {
    expect(sortCodeValidator(new FormControl(value))).toEqual({ invalidSortCode: true });
  });

  it.each(['123456', '12-34-56', '12 34 56'])('should accept sort code %s', (value) => {
    expect(sortCodeValidator(new FormControl(value))).toBeNull();
  });
});

describe('normalizeSortCode', () => {
  it.each(['123456', '12-34-56', '12 34 56'])('should normalize %s to six digits', (value) => {
    expect(normalizeSortCode(value)).toBe('123456');
  });
});
