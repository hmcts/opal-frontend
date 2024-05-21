import { ValidatorFn, AbstractControl } from '@angular/forms';

export function specialCharactersValidator(): ValidatorFn {
  const specialCharactersPattern = /\*/;
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      const hasSpecialCharacters = specialCharactersPattern.test(control.value);
      return hasSpecialCharacters ? { specialCharactersPattern: { value: control.value } } : null;
    }
    return null;
  };
}
