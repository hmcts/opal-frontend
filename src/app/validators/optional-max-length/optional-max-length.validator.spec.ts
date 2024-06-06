import { FormControl } from '@angular/forms';
import { optionalMaxLengthValidator } from './optional-max-length.validator';

describe('optionalMaxLengthValidator', () => {
  it('should return null if control value is null', () => {
    const control = new FormControl(null);
    const result = optionalMaxLengthValidator(5)(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is undefined', () => {
    const control = new FormControl(undefined);
    const result = optionalMaxLengthValidator(5)(control);
    expect(result).toBeNull();
  });

  it('should return null if control value is an empty string', () => {
    const control = new FormControl('');
    const result = optionalMaxLengthValidator(5)(control);
    expect(result).toBeNull();
  });

  it('should return null if control value length is within the max length', () => {
    const control = new FormControl('123');
    const result = optionalMaxLengthValidator(5)(control);
    expect(result).toBeNull();
  });

  it('should return an error object if control value length exceeds the max length', () => {
    const control = new FormControl('123456');
    const result = optionalMaxLengthValidator(5)(control);
    expect(result).toEqual({ maxlength: { requiredLength: 5, actualLength: 6 } });
  });
});
