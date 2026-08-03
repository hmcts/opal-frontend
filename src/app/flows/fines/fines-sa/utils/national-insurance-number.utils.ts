import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const NATIONAL_INSURANCE_NUMBER_MAX_LENGTH = 9;

export const normalizeNationalInsuranceNumber = (nationalInsuranceNumber: string | null): string | null =>
  nationalInsuranceNumber?.replace(/\s+/g, '').toUpperCase() ?? null;

export const nationalInsuranceNumberMaxLengthValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;

  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.replace(/\s+/g, '').toUpperCase();

  return normalizedValue.length > NATIONAL_INSURANCE_NUMBER_MAX_LENGTH
    ? {
        maxlength: {
          requiredLength: NATIONAL_INSURANCE_NUMBER_MAX_LENGTH,
          actualLength: normalizedValue.length,
        },
      }
    : null;
};
