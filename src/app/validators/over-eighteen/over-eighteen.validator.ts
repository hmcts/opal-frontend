import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { DateService } from '@services/date-service/date.service';

/**
 * Validates whether a date, constructed from provided form controls for day, month and year
 * is at least 18 years in the past.
 *
 * @param dayControl - Name of the control for the day portion of the date
 * @param monthControl - Name of the control for the month portion of the date
 * @param yearControl  - Name of the control for the year portion of the date
 * @param dateService - An instance of DateService
 * @returns Validator function that returns null if the date is valid and the age is 18 years older,
 * or an error object within { underEighteen: true } if under 18.
 */
export const overEighteenValidator = (
  dayControl: string,
  monthControl: string,
  yearControl: string,
  dateService: DateService,
): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const day = group.get(dayControl);
    const month = group.get(monthControl);
    const year = group.get(yearControl);

    // Return if controls are not defined or values are not provided
    if (!day || !month || !year || !day.value || !month.value || !year.value) {
      return null;
    }

    // Format day and month to ensure two digits
    const formattedDay = day.value.toString().padStart(2, '0');
    const formattedMonth = month.value.toString().padStart(2, '0');
    const formattedYear = year.value.toString();

    // Create the date string in the format dd/MM/yyyy
    const dateValue = `${formattedDay}/${formattedMonth}/${formattedYear}`;
    const inputDate = dateService.getFromFormat(dateValue, 'dd/MM/yyyy');

    if (inputDate.isValid) {
      // Verify if the entered date is at least 18 years in the past
      const underEighteen = inputDate.diffNow('years').years > -18;

      if (underEighteen) {
        year.setErrors({ underEighteen: true });
        return { underEighteen: true };
      } else {
        year.setErrors(null);
        return null;
      }
    } else {
      return null;
    }
  };
};
