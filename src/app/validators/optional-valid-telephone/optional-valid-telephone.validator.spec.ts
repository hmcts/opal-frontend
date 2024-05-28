import { FormControl } from '@angular/forms';
import { optionalPhoneNumberValidator } from './optional-valid-telephone.validator';

describe('optionalPhoneNumberValidator', () => {
  it('should return null for empty input', () => {
    const control = new FormControl('');
    const validator = optionalPhoneNumberValidator();
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for valid phone number with spaces', () => {
    const control = new FormControl('123 456 789 01');
    const validator = optionalPhoneNumberValidator();
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return null for valid phone number without spaces', () => {
    const control = new FormControl('12345678901');
    const validator = optionalPhoneNumberValidator();
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return error for invalid characters', () => {
    const control = new FormControl('123 456 7890a');
    const validator = optionalPhoneNumberValidator();
    const result = validator(control);
    expect(result).toEqual({ phoneNumberPattern: { value: '123 456 7890a' } });
  });

  it('should return error for less than 11 digits', () => {
    const control = new FormControl('123 456 7890');
    const validator = optionalPhoneNumberValidator();
    const result = validator(control);
    expect(result).toEqual({ phoneNumberPattern: { value: '123 456 7890' } });
  });

  it('should return error for more than 11 digits', () => {
    const control = new FormControl('123 456 789 012');
    const validator = optionalPhoneNumberValidator();
    const result = validator(control);
    expect(result).toEqual({ phoneNumberPattern: { value: '123 456 789 012' } });
  });

  it('should return null for exactly 11 digits with spaces', () => {
    const control = new FormControl('123 456 78901');
    const validator = optionalPhoneNumberValidator();
    const result = validator(control);
    expect(result).toBeNull();
  });
});
