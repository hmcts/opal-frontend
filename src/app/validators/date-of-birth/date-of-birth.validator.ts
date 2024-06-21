import { ValidatorFn, AbstractControl } from '@angular/forms';

export function dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value) {
      const [day, month, year] = value.split('/').map((part: string) => parseInt(part, 10));
      const date = new Date(year, month - 1, day);

      // Check if the date is in the past
      const today = new Date();
      // Set the time of today to the start of the day to avoid time comparison issues
      today.setHours(0, 0, 0, 0);

      if (date >= today) {
        return { invalidDateOfBirth: { value: value } };
      }
    }
    return null;
  };
}
