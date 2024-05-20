import { FormControl } from '@angular/forms';
import { optionalPhoneNumberValidator } from './optional-valid-telephone.validator';

describe('optionalPhoneNumberValidator', () => {
  it('should return null if control value is null', () => {
    const control = new FormControl(null);
    const result = optionalPhoneNumberValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is undefined', () => {
    const control = new FormControl(undefined);
    const result = optionalPhoneNumberValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is an empty string', () => {
    const control = new FormControl('');
    const result = optionalPhoneNumberValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null if control value contains only digits', () => {
    const control = new FormControl('1234567890');
    const result = optionalPhoneNumberValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object if control value contains non-numeric characters', () => {
    const control = new FormControl('123abc456');
    const result = optionalPhoneNumberValidator()(control);
    expect(result).toEqual({ phoneNumberPattern: { value: '123abc456' } });
  });

  it('should return an error object if control value contains spaces', () => {
    const control = new FormControl('123 456 7890');
    const result = optionalPhoneNumberValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object if control value contains special characters', () => {
    const control = new FormControl('123-456-7890');
    const result = optionalPhoneNumberValidator()(control);
    expect(result).toEqual({ phoneNumberPattern: { value: '123-456-7890' } });
  });
});
