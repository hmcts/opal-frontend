import { FormControl } from '@angular/forms';
import { futureDateValidator } from './future-date.validator';
import { DateTime } from 'luxon';

describe('futureDateValidator', () => {
  it('should return null for a valid future date', () => {
    const control = new FormControl('12/31/2022');
    const validator = futureDateValidator();
    const result = validator(control);
    expect(result).toBeNull();
  });

  it('should return an error object for an invalid future date', () => {
    const tomorrow = DateTime.now().plus({ days: 1 }).toFormat('dd/MM/yyyy');
    const control = new FormControl(tomorrow);
    const validator = futureDateValidator();
    const result = validator(control);
    expect(result).toEqual({ invalidFutureDate: { value: tomorrow } });
  });

  it('should return null for an empty control value', () => {
    const control = new FormControl('');
    const validator = futureDateValidator();
    const result = validator(control);
    expect(result).toBeNull();
  });
});
