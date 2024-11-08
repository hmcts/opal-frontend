import { ValidatorFn, AbstractControl } from '@angular/forms';

export function dateBeforeValidator(targetDate: Date | null): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const inputValue = control.value;
    if (!inputValue || !targetDate) {
      return null;
    }

    const [day, month, year] = inputValue.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day);

    if (inputDate < targetDate) {
      return { dateNotBefore: { value: inputValue } };
    }

    return null;
  };
}
