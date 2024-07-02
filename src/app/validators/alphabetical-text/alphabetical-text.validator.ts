import { ValidatorFn, AbstractControl } from '@angular/forms';

export function alphabeticalTextValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value && !/^[a-zA-Z0-9'()*_., -]*$/.test(value)) {
      return { alphabeticalTextPattern: { value: value } };
    }
    return null;
  };
}
