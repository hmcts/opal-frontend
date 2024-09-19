import { ValidatorFn, AbstractControl } from '@angular/forms';

export function dateAfterYearValidator(year: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      const yearInput = Number(control.value.split('/')[2]);

      if (yearInput <= year) {
        return { invalidYear: { value: control.value } };
      }
    }
    return null;
  };
}
