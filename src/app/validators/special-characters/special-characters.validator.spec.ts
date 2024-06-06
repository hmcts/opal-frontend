import { FormControl } from '@angular/forms';
import { specialCharactersValidator } from './special-characters.validator';

describe('specialCharactersValidator', () => {
  it('should return null if control value is null', () => {
    const control = new FormControl(null);
    const result = specialCharactersValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is undefined', () => {
    const control = new FormControl(undefined);
    const result = specialCharactersValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is an empty string', () => {
    const control = new FormControl('');
    const result = specialCharactersValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null if control value does not contain an asterisk', () => {
    const control = new FormControl('HelloWorld');
    const result = specialCharactersValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object if control value contains an asterisk', () => {
    const control = new FormControl('Hello*World');
    const result = specialCharactersValidator()(control);
    expect(result).toEqual({ specialCharactersPattern: { value: 'Hello*World' } });
  });

  it('should return an error object if control value contains multiple asterisks', () => {
    const control = new FormControl('Hello**World');
    const result = specialCharactersValidator()(control);
    expect(result).toEqual({ specialCharactersPattern: { value: 'Hello**World' } });
  });

  it('should return null if control value contains special characters other than an asterisk', () => {
    const control = new FormControl('Hello@World');
    const result = specialCharactersValidator()(control);
    expect(result).toBeNull();
  });
});
