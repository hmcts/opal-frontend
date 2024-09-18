import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function twoDecimalPlacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // No validation if empty
    }

    // Check if the value is a valid number with up to 2 decimal places
    const decimalRegex = /^\d+(\.\d{0,2})?$/;

    return decimalRegex.test(value) ? null : { invalidDecimal: true };
  };
}
