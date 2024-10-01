import { ValidatorFn, AbstractControl } from '@angular/forms';

export function pastDateValidator(): ValidatorFn {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to start of the day to avoid time comparison issues

  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      const [day, month, year] = control.value.split('/');
      const date = new Date(Date.parse(`${month}/${day}/${year}`));

      // Check if the date is in the past
      if (date < today) {
        return { invalidPastDate: { value: control.value } };
      }
    }
    return null;
  };
}
