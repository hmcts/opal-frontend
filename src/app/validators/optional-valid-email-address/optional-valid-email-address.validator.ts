import { ValidatorFn, AbstractControl } from '@angular/forms';

export function optionalEmailAddressValidator(): ValidatorFn {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      const valid = emailPattern.test(control.value);
      return valid ? null : { emailPattern: { value: control.value } };
    }
    return null;
  };
}
