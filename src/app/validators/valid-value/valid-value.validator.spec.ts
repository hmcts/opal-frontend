import { FormControl } from '@angular/forms';
import { validValueValidator } from './valid-value.validator';

describe('validValueValidator', () => {
  const validCjsCodes = ['AK123456', 'CA03010D', 'GMMET001'];

  it('should return null if the value exists in the array', () => {
    const control = new FormControl('AK123456');
    const validator = validValueValidator(validCjsCodes);

    expect(validator(control)).toBeNull(); // The value is in the array, so it should be valid
  });

  it('should return an error if the value does not exist in the array', () => {
    const control = new FormControl('INVALID_CODE');
    const validator = validValueValidator(validCjsCodes);

    expect(validator(control)).toEqual({ valueNotInArray: true }); // The value is not in the array, so it should be invalid
  });

  it('should return null if the value is empty', () => {
    const control = new FormControl('');
    const validator = validValueValidator(validCjsCodes);

    expect(validator(control)).toBeNull(); // An empty value should not trigger a validation error
  });

  it('should return null if the value is null', () => {
    const control = new FormControl(null);
    const validator = validValueValidator(validCjsCodes);

    expect(validator(control)).toBeNull(); // A null value should not trigger a validation error
  });

  it('should return null if the value is undefined', () => {
    const control = new FormControl(undefined);
    const validator = validValueValidator(validCjsCodes);

    expect(validator(control)).toBeNull(); // An undefined value should not trigger a validation error
  });

  it('should return an error for case-sensitive mismatch', () => {
    const control = new FormControl('ak123456'); // Lowercase version
    const validator = validValueValidator(validCjsCodes);

    expect(validator(control)).toEqual({ valueNotInArray: true }); // Should be invalid due to case mismatch
  });

  it('should return null for values with exact case match', () => {
    const control = new FormControl('CA03010D'); // Matching exact case
    const validator = validValueValidator(validCjsCodes);

    expect(validator(control)).toBeNull(); // Should be valid because the case matches exactly
  });
});
