import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function amountValidator(maxIntegers: number, maxDecimals: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    // Ensure the value is numerical, allowing only digits and optionally one decimal point
    if (isNaN(control.value)) {
      return { invalidAmountValue: true };
    }

    // Regex to match numbers with the specified integer and decimal places
    const regex = new RegExp(`^-?(0|[1-9]\\d{0,${maxIntegers - 1}})(\\.\\d{0,${maxDecimals}})?$`);

    return regex.test(control.value) ? null : { invalidAmount: true };
  };
}
