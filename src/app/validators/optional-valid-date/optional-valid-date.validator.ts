import { ValidatorFn, AbstractControl } from '@angular/forms';

export function optionalValidDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value) {
      // Check if the value matches the format dd/MM/yyyy
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = value.match(dateRegex);

      if (!match) {
        return { invalidDateFormat: { value: value } };
      }

      const [, day, month, year] = match;

      // Check if the date is valid
      const date = new Date(`${year}-${month}-${day}`);
      if (
        date.getDate() !== parseInt(day, 10) ||
        date.getMonth() + 1 !== parseInt(month, 10) ||
        date.getFullYear() !== parseInt(year, 10)
      ) {
        return { invalidDate: { value: value } };
      }
    }
    return null;
  };
}
