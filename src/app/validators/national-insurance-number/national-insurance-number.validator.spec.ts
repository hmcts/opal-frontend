import { FormControl } from '@angular/forms';
import { nationalInsuranceNumberValidator } from './national-insurance-number.validator';

describe('nationalInsuranceNumberValidator', () => {
  it('should return null for a valid NINO with spaces', () => {
    const control = new FormControl('QQ 12 34 56 C');
    const result = nationalInsuranceNumberValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for a valid NINO without spaces', () => {
    const control = new FormControl('QQ123456C');
    const result = nationalInsuranceNumberValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object for an invalid NINO (wrong format)', () => {
    const control = new FormControl('AB12345Z');
    const result = nationalInsuranceNumberValidator()(control);
    expect(result).toEqual({ nationalInsuranceNumberPattern: { value: 'AB12345Z' } });
  });

  it('should return an error object for a NINO with special characters', () => {
    const control = new FormControl('QQ12-34-56C');
    const result = nationalInsuranceNumberValidator()(control);
    expect(result).toEqual({ nationalInsuranceNumberPattern: { value: 'QQ12-34-56C' } });
  });

  it('should return an error object for a NINO with invalid ending letter', () => {
    const control = new FormControl('QQ123456Z');
    const result = nationalInsuranceNumberValidator()(control);
    expect(result).toEqual({ nationalInsuranceNumberPattern: { value: 'QQ123456Z' } });
  });

  it('should return an error object for a NINO with more than 9 characters', () => {
    const control = new FormControl('QQ1234567C');
    const result = nationalInsuranceNumberValidator()(control);
    expect(result).toEqual({ nationalInsuranceNumberPattern: { value: 'QQ1234567C' } });
  });

  it('should return null for an empty string', () => {
    const control = new FormControl('');
    const result = nationalInsuranceNumberValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for a null value', () => {
    const control = new FormControl(null);
    const result = nationalInsuranceNumberValidator()(control);
    expect(result).toBeNull();
  });
});
