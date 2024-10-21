import { FormControl } from '@angular/forms';
import { invalidValueValidator } from './invalid-value.validator';

describe('invalidValueValidator', () => {
  const invalidCjsCodes = ['AK123456', 'CA03010D', 'GMMET001'];

  it('should return an error if the value exists in the array', () => {
    const control = new FormControl('AK123456');
    const validator = invalidValueValidator(invalidCjsCodes);

    expect(validator(control)).toEqual({ valueInArray: true }); // The value is in the array, so it should be invalid
  });

  it('should return null if the value does not exist in the array', () => {
    const control = new FormControl('INVALID_CODE');
    const validator = invalidValueValidator(invalidCjsCodes);

    expect(validator(control)).toBeNull(); // The value is not in the array, so it should be valid
  });

  it('should return null if the value is empty', () => {
    const control = new FormControl('');
    const validator = invalidValueValidator(invalidCjsCodes);

    expect(validator(control)).toBeNull(); // An empty value should not trigger a validation error
  });

  it('should return null if the value is null', () => {
    const control = new FormControl(null);
    const validator = invalidValueValidator(invalidCjsCodes);

    expect(validator(control)).toBeNull(); // A null value should not trigger a validation error
  });

  it('should return null if the value is undefined', () => {
    const control = new FormControl(undefined);
    const validator = invalidValueValidator(invalidCjsCodes);

    expect(validator(control)).toBeNull(); // An undefined value should not trigger a validation error
  });

  it('should return null for case-sensitive mismatch', () => {
    const control = new FormControl('ak123456'); // Lowercase version
    const validator = invalidValueValidator(invalidCjsCodes);

    expect(validator(control)).toBeNull(); // Should be valid because the case doesn't match
  });

  it('should return an error for values with exact case match', () => {
    const control = new FormControl('CA03010D'); // Matching exact case
    const validator = invalidValueValidator(invalidCjsCodes);

    expect(validator(control)).toEqual({ valueInArray: true }); // Should be invalid because the case matches exactly
  });
});
