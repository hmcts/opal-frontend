import { ValidatorFn, AbstractControl } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      const [day, month, year] = control.value.split('/');
      const date = new Date(Date.parse(`${month}/${day}/${year}`));

      // Check if the date is in the future
      const today = new Date();

      if (date >= today) {
        return { invalidFutureDate: { value: control.value } };
      }
    }
    return null;
  };
}
