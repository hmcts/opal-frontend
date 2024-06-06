import { FormControl } from '@angular/forms';
import { optionalEmailAddressValidator } from './optional-valid-email-address.validator';

describe('optionalEmailAddressValidator', () => {
  it('should return null if control value is null', () => {
    const control = new FormControl(null);
    const result = optionalEmailAddressValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is undefined', () => {
    const control = new FormControl(undefined);
    const result = optionalEmailAddressValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is an empty string', () => {
    const control = new FormControl('');
    const result = optionalEmailAddressValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is a valid email address', () => {
    const control = new FormControl('test@example.com');
    const result = optionalEmailAddressValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object if control value is an invalid email address', () => {
    const control = new FormControl('invalid-email');
    const result = optionalEmailAddressValidator()(control);
    expect(result).toEqual({ emailPattern: { value: 'invalid-email' } });
  });

  it('should return an error object if control value is missing the domain', () => {
    const control = new FormControl('test@');
    const result = optionalEmailAddressValidator()(control);
    expect(result).toEqual({ emailPattern: { value: 'test@' } });
  });

  it('should return an error object if control value is missing the "@" symbol', () => {
    const control = new FormControl('testexample.com');
    const result = optionalEmailAddressValidator()(control);
    expect(result).toEqual({ emailPattern: { value: 'testexample.com' } });
  });

  it('should return an error object if control value is missing the top-level domain', () => {
    const control = new FormControl('test@example');
    const result = optionalEmailAddressValidator()(control);
    expect(result).toEqual({ emailPattern: { value: 'test@example' } });
  });
});
