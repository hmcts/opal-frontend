import { FormControl } from '@angular/forms';
import { twoDecimalPlacesValidator } from './two-decimal-places.validator';

describe('twoDecimalPlacesValidator', () => {
  let control: FormControl | null;

  beforeEach(() => {
    control = new FormControl('');
  });

  afterAll(() => {
    control = null;
  });

  it('should return null if the value is empty', () => {
    if (!control) {
      fail('Required properties not properly initialised');
      return;
    }

    control.setValue('');
    expect(twoDecimalPlacesValidator()(control)).toBeNull();
  });

  it('should return null for valid values with no decimal places', () => {
    if (!control) {
      fail('Required properties not properly initialised');
      return;
    }

    control.setValue('123');
    expect(twoDecimalPlacesValidator()(control)).toBeNull();
  });

  it('should convert values with 1 decimal place to 2 decimal places', () => {
    if (!control) {
      fail('Required properties not properly initialised');
      return;
    }

    control.setValue('123.4');
    twoDecimalPlacesValidator()(control);
    expect(twoDecimalPlacesValidator()(control)).toBeNull();
  });

  it('should return null for valid values with 2 decimal places', () => {
    if (!control) {
      fail('Required properties not properly initialised');
      return;
    }

    control.setValue('123.45');
    expect(twoDecimalPlacesValidator()(control)).toBeNull();
  });

  it('should return an error for values with more than 2 decimal places', () => {
    if (!control) {
      fail('Required properties not properly initialised');
      return;
    }

    control.setValue('123.456');
    expect(twoDecimalPlacesValidator()(control)).toEqual({ invalidDecimal: true });
  });

  it('should return an error for non-numerical values', () => {
    if (!control) {
      fail('Required properties not properly initialised');
      return;
    }

    control.setValue('abc');
    expect(twoDecimalPlacesValidator()(control)).toEqual({ invalidDecimal: true });
  });

  it('should return an error for values with non-numerical characters', () => {
    if (!control) {
      fail('Required properties not properly initialised');
      return;
    }

    control.setValue('123abc');
    expect(twoDecimalPlacesValidator()(control)).toEqual({ invalidDecimal: true });
  });
});
