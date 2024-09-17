import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { dateOfBirthValidator } from '@validators/date-of-birth/date-of-birth.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT_DATE: IAbstractFormArrayControlValidation = {
  controlName: 'days_in_default_date',
  validators: [Validators.required, dateOfBirthValidator(), optionalValidDateValidator()],
};
