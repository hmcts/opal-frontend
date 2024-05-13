import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { DateTime } from 'luxon';

export const beforeDateValidator = (
  dayControl: string,
  monthControl: string,
  yearControl: string,
  beforeDate: string,
): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const day = group.get(dayControl);
    const month = group.get(monthControl);
    const year = group.get(yearControl);
    if (!day || !month || !year) {
        return {error: null};
    }

    // return if no data value exists on controls
    if (!day.value || !month.value || !year.value) {
        return {error: null};
    }

    // return if another validator has already found an error
    if (day.errors || month.errors || year.errors) {
        return {error: null};
    }

    const dateValue = `${day.value}/${month.value}/${year.value}`;
    const dateFormat = 'dd/MM/yyyy';
    const inputDate = DateTime.fromFormat(dateValue, dateFormat);
    const specifiedBeforeDate = DateTime.fromFormat(beforeDate, dateFormat);

    if (inputDate.isValid && specifiedBeforeDate.isValid && inputDate >= specifiedBeforeDate) {
      day.setErrors({ beforeDate: true });
      month.setErrors({ beforeDate: true });
      year.setErrors({ beforeDate: true });
    } else {
      day.setErrors(null);
      month.setErrors(null);
      year.setErrors(null);
    }

    return {error: null};
  };
};
