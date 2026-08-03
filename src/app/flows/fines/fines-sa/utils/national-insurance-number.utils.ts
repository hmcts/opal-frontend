import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const NATIONAL_INSURANCE_NUMBER_MAX_LENGTH = 9;

export function normalizeNationalInsuranceNumber(nationalInsuranceNumber: string): string;
export function normalizeNationalInsuranceNumber(nationalInsuranceNumber: null): null;
export function normalizeNationalInsuranceNumber(nationalInsuranceNumber: string | null): string | null {
  return nationalInsuranceNumber?.replace(/\s+/g, '').toUpperCase() ?? null;
}

export const nationalInsuranceNumberMaxLengthValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = normalizeNationalInsuranceNumber(value);

  return normalizedValue.length > NATIONAL_INSURANCE_NUMBER_MAX_LENGTH
    ? {
        maxlength: {
          requiredLength: NATIONAL_INSURANCE_NUMBER_MAX_LENGTH,
          actualLength: normalizedValue.length,
        },
      }
    : null;
};
