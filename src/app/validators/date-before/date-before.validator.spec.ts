import { FormControl } from '@angular/forms';
import { dateBeforeValidator } from './date-before.validator';

describe('dateBeforeValidator', () => {
  it('should return null if control value is null', () => {
    const validator = dateBeforeValidator(new Date('2023-12-31'));
    const control = new FormControl(null);
    expect(validator(control)).toBeNull();
  });

  it('should return null if target date is null', () => {
    const validator = dateBeforeValidator(null);
    const control = new FormControl('01/01/2023');
    expect(validator(control)).toBeNull();
  });

  it('should return an error object if input date is not before target date', () => {
    const validator = dateBeforeValidator(new Date('2023-12-31'));
    const control = new FormControl('30/12/2023');
    expect(validator(control)).toEqual({ dateNotBefore: { value: '30/12/2023' } });
  });

  it('should return null if input date is equal to target date', () => {
    const validator = dateBeforeValidator(new Date('2023-12-31'));
    const control = new FormControl('31/12/2023');
    expect(validator(control)).toBeNull();
  });

  it('should return null if input date is after target date', () => {
    const validator = dateBeforeValidator(new Date('2023-12-31'));
    const control = new FormControl('01/01/2024');
    expect(validator(control)).toBeNull();
  });
});
