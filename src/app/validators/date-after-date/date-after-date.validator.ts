import { ValidatorFn, AbstractControl } from '@angular/forms';
import { DateTime } from 'luxon'; // Assuming you are using Luxon

export function dateAfterSuppliedValidator(suppliedDate: string | null): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      const [day, month, year] = control.value.split('/');
      const controlDate = DateTime.fromFormat(`${day}/${month}/${year}`, 'dd/MM/yyyy');

      if (!controlDate.isValid) {
        return { invalidDate: { value: control.value } }; // Optionally check for valid date
      }

      if (suppliedDate) {
        const suppliedLuxonDate = DateTime.fromISO(suppliedDate);

        // Compare control's date to supplied date
        if (controlDate > suppliedLuxonDate) {
          return { dateAfterSupplied: { value: control.value } };
        }
      }
    }
    return null;
  };
}
