import { FormControl } from '@angular/forms';
import { dateOfBirthValidator } from './date-of-birth.validator';

describe('dateOfBirthValidator', () => {
  it('should return null for a date in the past', () => {
    const control = new FormControl('01/01/2020');
    const result = dateOfBirthValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object for a date in the future', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const control = new FormControl(
      `${futureDate.getDate().toString().padStart(2, '0')}/${(futureDate.getMonth() + 1).toString().padStart(2, '0')}/${futureDate.getFullYear()}`,
    );
    const result = dateOfBirthValidator()(control);
    expect(result).toEqual({ invalidDateOfBirth: { value: control.value } });
  });

  it("should return an error object for today's date", () => {
    const today = new Date();
    const control = new FormControl(
      `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`,
    );
    const result = dateOfBirthValidator()(control);
    expect(result).toEqual({ invalidDateOfBirth: { value: control.value } });
  });

  it('should return null for an empty string', () => {
    const control = new FormControl('');
    const result = dateOfBirthValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for a null value', () => {
    const control = new FormControl(null);
    const result = dateOfBirthValidator()(control);
    expect(result).toBeNull();
  });
});
