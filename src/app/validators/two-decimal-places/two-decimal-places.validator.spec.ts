import { FormControl } from '@angular/forms';
import { twoDecimalPlacesValidator } from './two-decimal-places.validator';

describe('twoDecimalPlacesValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('');
  });

  it('should return null if the value is empty', () => {
    control.setValue('');
    expect(twoDecimalPlacesValidator()(control)).toBeNull();
  });

  it('should return null for valid values with no decimal places', () => {
    control.setValue('123');
    expect(twoDecimalPlacesValidator()(control)).toBeNull();
  });

  it('should convert values with 1 decimal place to 2 decimal places', () => {
    control.setValue('123.4');
    twoDecimalPlacesValidator()(control);
    expect(twoDecimalPlacesValidator()(control)).toBeNull();
  });

  it('should return null for valid values with 2 decimal places', () => {
    control.setValue('123.45');
    expect(twoDecimalPlacesValidator()(control)).toBeNull();
  });

  it('should return an error for values with more than 2 decimal places', () => {
    control.setValue('123.456');
    expect(twoDecimalPlacesValidator()(control)).toEqual({ invalidDecimal: true });
  });

  it('should return an error for non-numerical values', () => {
    control.setValue('abc');
    expect(twoDecimalPlacesValidator()(control)).toEqual({ invalidDecimal: true });
  });

  it('should return an error for values with non-numerical characters', () => {
    control.setValue('123abc');
    expect(twoDecimalPlacesValidator()(control)).toEqual({ invalidDecimal: true });
  });
});
