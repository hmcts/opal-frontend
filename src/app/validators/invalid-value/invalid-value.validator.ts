import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function invalidValueValidator(invalidValues: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    return invalidValues.some((value) => value === control.value) ? { valueInArray: true } : null;
  };
}
