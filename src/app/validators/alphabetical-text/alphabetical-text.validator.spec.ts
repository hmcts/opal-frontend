import { FormControl } from '@angular/forms';
import { alphabeticalTextValidator } from './alphabetical-text.validator';

describe('alphabeticalTextValidator', () => {
  it('should return null for an empty string', () => {
    const control = new FormControl('');
    const result = alphabeticalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for a null value', () => {
    const control = new FormControl(null);
    const result = alphabeticalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for a valid alphabetical string', () => {
    const control = new FormControl('ValidText');
    const result = alphabeticalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for a valid alphabetical string with spaces', () => {
    const control = new FormControl('Valid Text With Spaces');
    const result = alphabeticalTextValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object for a string with numbers', () => {
    const control = new FormControl('Invalid123');
    const result = alphabeticalTextValidator()(control);
    expect(result).toEqual({ alphabeticalTextPattern: { value: 'Invalid123' } });
  });

  it('should return an error object for a string with special characters', () => {
    const control = new FormControl('Invalid!@#');
    const result = alphabeticalTextValidator()(control);
    expect(result).toEqual({ alphabeticalTextPattern: { value: 'Invalid!@#' } });
  });

  it('should return an error object for a string with mixed valid and invalid characters', () => {
    const control = new FormControl('Valid123Invalid');
    const result = alphabeticalTextValidator()(control);
    expect(result).toEqual({ alphabeticalTextPattern: { value: 'Valid123Invalid' } });
  });
});
