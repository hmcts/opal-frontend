import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { finesMacOffenceDetailsPositiveAmountValidator } from './fines-mac-offence-details-positive-amount.validator';

describe('finesMacOffenceDetailsPositiveAmountValidator', () => {
  const validator = finesMacOffenceDetailsPositiveAmountValidator();

  it('should return null for empty values', () => {
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(''))).toBeNull();
  });

  it('should return null for positive amounts', () => {
    expect(validator(new FormControl(1))).toBeNull();
    expect(validator(new FormControl('1.01'))).toBeNull();
  });

  it('should return invalidZeroAmount for zero amounts', () => {
    expect(validator(new FormControl(0))).toEqual({ invalidZeroAmount: true });
    expect(validator(new FormControl('0.00'))).toEqual({ invalidZeroAmount: true });
  });

  it('should return invalidNegativeAmount for negative amounts', () => {
    expect(validator(new FormControl(-1))).toEqual({ invalidNegativeAmount: true });
    expect(validator(new FormControl('-12.50'))).toEqual({ invalidNegativeAmount: true });
  });

  it('should ignore non-numeric values so amountValidator handles them', () => {
    expect(validator(new FormControl('abc'))).toBeNull();
  });
});
