import { ValidatorFn, AbstractControl, Validators } from '@angular/forms';

export function optionalMaxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      return Validators.maxLength(maxLength)(control);
    }
    return null;
  };
}
