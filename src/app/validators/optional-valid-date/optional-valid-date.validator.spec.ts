import { FormControl } from '@angular/forms';
import { optionalValidDateValidator } from './optional-valid-date.validator';

describe('optionalValidDateValidator', () => {
  it('should return null for a valid date', () => {
    const control = new FormControl('01/01/2020');
    const result = optionalValidDateValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object for a day not being 2 length', () => {
    const control = new FormControl('1/01/2020');
    const result = optionalValidDateValidator()(control);
    expect(result).toEqual({ invalidDateFormat: { value: '1/01/2020' } });
  });

  it('should return an error object for a month not being 2 length', () => {
    const control = new FormControl('01/1/2020');
    const result = optionalValidDateValidator()(control);
    expect(result).toEqual({ invalidDateFormat: { value: '01/1/2020' } });
  });

  it('should return an error object for a year not being 4 length', () => {
    const control = new FormControl('01/01/20');
    const result = optionalValidDateValidator()(control);
    expect(result).toEqual({ invalidDateFormat: { value: '01/01/20' } });
  });

  it('should return an error object for a day not being 2 length, month not being 2 length and a year not being 4 length', () => {
    const control = new FormControl('1/1/20');
    const result = optionalValidDateValidator()(control);
    expect(result).toEqual({ invalidDateFormat: { value: '1/1/20' } });
  });

  it('should return an error object for an invalid date format', () => {
    const control = new FormControl('2020/01/01');
    const result = optionalValidDateValidator()(control);
    expect(result).toEqual({ invalidDateFormat: { value: '2020/01/01' } });
  });

  it('should return an error object for a non-date string', () => {
    const control = new FormControl('invalid date');
    const result = optionalValidDateValidator()(control);
    expect(result).toEqual({ invalidDateFormat: { value: 'invalid date' } });
  });

  it('should return an error object for a date with invalid day', () => {
    const control = new FormControl('32/01/2020');
    const result = optionalValidDateValidator()(control);
    expect(result).toEqual({ invalidDate: { value: '32/01/2020' } });
  });

  it('should return an error object for a date with invalid month', () => {
    const control = new FormControl('01/13/2020');
    const result = optionalValidDateValidator()(control);
    expect(result).toEqual({ invalidDate: { value: '01/13/2020' } });
  });

  it('should return an error object for a date with invalid year', () => {
    const control = new FormControl('01/01/20');
    const result = optionalValidDateValidator()(control);
    expect(result).toEqual({ invalidDateFormat: { value: '01/01/20' } });
  });

  it('should return null for an empty string', () => {
    const control = new FormControl('');
    const result = optionalValidDateValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for a null value', () => {
    const control = new FormControl(null);
    const result = optionalValidDateValidator()(control);
    expect(result).toBeNull();
  });
});
