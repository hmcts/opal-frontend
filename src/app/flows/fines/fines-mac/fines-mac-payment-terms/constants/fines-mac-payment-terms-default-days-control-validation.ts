import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { Validators } from '@angular/forms';
import { dateOfBirthValidator } from '@validators/date-of-birth/date-of-birth.validator';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { numericalTextValidator } from '@validators/numerical-only/numerical-only.validator';

export const FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_payment_terms_days_in_default_date',
    validators: [Validators.required, dateOfBirthValidator(), optionalValidDateValidator()],
  },
  {
    controlName: 'fm_payment_terms_days_in_default',
    validators: [Validators.required, Validators.maxLength(5), numericalTextValidator()],
  },
];
