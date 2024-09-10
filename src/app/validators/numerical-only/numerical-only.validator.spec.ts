import { FormControl } from '@angular/forms';
import { numericalTextValidator } from './numerical-only.validator';

describe('numericalTextValidator', () => {
  it('should return null for a valid numerical string', () => {
    const control = new FormControl('123456');
    const result = numericalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for an empty string', () => {
    const control = new FormControl('');
    const result = numericalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object for a string with non-numerical characters', () => {
    const control = new FormControl('123abc');
    const result = numericalTextValidator()(control);
    expect(result).toEqual({ numericalTextPattern: { value: '123abc' } });
  });

  it('should return an error object for a string with special characters', () => {
    const control = new FormControl('123!@#');
    const result = numericalTextValidator()(control);
    expect(result).toEqual({ numericalTextPattern: { value: '123!@#' } });
  });

  it('should return an error object for a string with spaces', () => {
    const control = new FormControl('123 456');
    const result = numericalTextValidator()(control);
    expect(result).toEqual({ numericalTextPattern: { value: '123 456' } });
  });

  it('should return an error object for a string with only alphabets', () => {
    const control = new FormControl('abc');
    const result = numericalTextValidator()(control);
    expect(result).toEqual({ numericalTextPattern: { value: 'abc' } });
  });
});
