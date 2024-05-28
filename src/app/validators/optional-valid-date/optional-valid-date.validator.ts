import { ValidatorFn, AbstractControl } from '@angular/forms';

export function optionalValidDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value) {
      // Check if the value matches the format dd/MM/yyyy
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const match = value.match(dateRegex);

      if (!match) {
        return { invalidDateFormat: { value: value } };
      }

      let [ , day, month, year ] = match;
      
      // Pad day and month with leading zeroes if necessary
      day = day.padStart(2, '0');
      month = month.padStart(2, '0');
      year = year.padStart(4, '0');

      const formattedDate = `${day}/${month}/${year}`;

      // Check if the date is valid
      const date = new Date(`${year}-${month}-${day}`);
      if (date.getDate() !== parseInt(day) || date.getMonth() + 1 !== parseInt(month) || date.getFullYear() !== parseInt(year)) {
        return { invalidDate: { value: value } };
      }
      
      control.setValue(formattedDate, { emitEvent: false });
    }
    return null;
  };
}
