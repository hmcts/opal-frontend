import { FormControl } from '@angular/forms';
import { amountValidator } from './amount.validator';

describe('amountValidator', () => {
  it('should return null if value is empty', () => {
    const control = new FormControl('');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toBeNull();
  });

  it('should validate a number with less than or equal to 18 integers and 2 decimal places', () => {
    const control = new FormControl('123456789012345678.12');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toBeNull(); // Should be valid
  });

  it('should invalidate a number with more than 18 integers', () => {
    const control = new FormControl('1234567890123456789.12');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toEqual({ invalidAmount: true }); // Should be invalid
  });

  it('should invalidate a number with more than 2 decimal places', () => {
    const control = new FormControl('123456789012345678.123');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toEqual({ invalidAmount: true }); // Should be invalid
  });

  it('should validate a number with fewer integers and decimals than allowed', () => {
    const control = new FormControl('123.1');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toBeNull(); // Should be valid
  });

  it('should validate a negative number with valid integers and decimals', () => {
    const control = new FormControl('-123456789012345678.12');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toBeNull(); // Should be valid
  });

  it('should invalidate a negative number with more than 18 integers', () => {
    const control = new FormControl('-1234567890123456789.12');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toEqual({ invalidAmount: true }); // Should be invalid
  });

  it('should validate zero as a valid number', () => {
    const control = new FormControl('0');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toBeNull(); // Should be valid
  });

  it('should invalidate numbers with leading zeros', () => {
    const control = new FormControl('0123.45');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toEqual({ invalidAmount: true }); // Should be invalid
  });

  it('should invalidate a value that is not a number', () => {
    const control = new FormControl('invalid-number');
    const validator = amountValidator(18, 2);

    expect(validator(control)).toEqual({ invalidAmountValue: true }); // Should be invalid because the value is not a number
  });
});
