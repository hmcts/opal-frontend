import { ValidatorFn, AbstractControl } from '@angular/forms';

export function numericalTextValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value && !/^\d*$/.test(value)) {
      return { numericalTextPattern: { value: value } };
    }
    return null;
  };
}
