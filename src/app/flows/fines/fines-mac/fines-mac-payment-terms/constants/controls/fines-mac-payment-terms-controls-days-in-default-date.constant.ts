import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';
import { dateOfBirthValidator, optionalValidDateValidator } from '@validators';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT_DATE: IAbstractFormArrayControlValidation = {
  controlName: 'days_in_default_date',
  validators: [Validators.required, dateOfBirthValidator(), optionalValidDateValidator()],
};
