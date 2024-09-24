import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validValueValidator(validValues: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    return validValues.some((value) => value === control.value) ? null : { valueNotInArray: true };
  };
}
