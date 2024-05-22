import { ValidatorFn, AbstractControl } from '@angular/forms';

export function optionalPhoneNumberValidator(): ValidatorFn {
  const numericPattern = /^[\d\s]*$/;
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      const valueWithoutSpaces = control.value.replace(/\s+/g, '');
      const isValidPattern = numericPattern.test(control.value);
      const isValidLength = valueWithoutSpaces.length === 11;
      const valid = isValidPattern && isValidLength;
      return valid ? null : { phoneNumberPattern: { value: control.value } };
    }
    return null;
  };
}
