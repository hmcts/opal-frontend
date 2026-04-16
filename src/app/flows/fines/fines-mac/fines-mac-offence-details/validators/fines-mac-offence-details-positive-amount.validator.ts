import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that the amount imposed is greater than zero.
 *
 * Returns null for empty or non-numeric values so the existing required and amount validators can surface their own errors.
 */
export function finesMacOffenceDetailsPositiveAmountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { value } = control;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsedValue = Number(value);

    if (Number.isNaN(parsedValue)) {
      return null;
    }

    if (parsedValue === 0) {
      return { invalidZeroAmount: true };
    }

    return parsedValue > 0 ? null : { invalidNegativeAmount: true };
  };
}
