import { dateAfterYearValidator } from './date-after-year.validator';
import { FormControl } from '@angular/forms';

describe('dateAfterYearValidator', () => {
  it('should return null if the year input is greater than the specified year', () => {
    const validator = dateAfterYearValidator(2020);
    const control = new FormControl('01/01/2022');
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return an error object if the year input is less than or equal to the specified year', () => {
    const validator = dateAfterYearValidator(2020);
    const control = new FormControl('01/01/2020');
    const result = validator(control);
    expect(result).toEqual({ invalidYear: { value: '01/01/2020' } });
  });

  it('should return null if the control value is empty', () => {
    const validator = dateAfterYearValidator(2020);
    const control = new FormControl('');
    const result = validator(control);
    expect(result).toBeNull();
  });
});
