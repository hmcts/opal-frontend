import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const normalizeSortCode = (value: string | null | undefined): string | null =>
  value == null ? null : value.replace(/[ -]/g, '');

const SORT_CODE_FORMAT = /^\d{2}(?:[- ]?\d{2}){2}$/;

export const sortCodeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string | null;

  if (!value) {
    return null;
  }

  const normalizedValue = normalizeSortCode(value);

  return SORT_CODE_FORMAT.test(value) && /^[0-9]{6}$/.test(normalizedValue ?? '') ? null : { invalidSortCode: true };
};
