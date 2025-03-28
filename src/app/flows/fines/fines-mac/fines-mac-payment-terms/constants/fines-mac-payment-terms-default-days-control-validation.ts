import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import {
  dateOfBirthValidator,
  numericalTextValidator,
  optionalValidDateValidator,
} from '@hmcts/opal-frontend-common/core/validators';

export const FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_payment_terms_suspended_committal_date',
    validators: [Validators.required, dateOfBirthValidator(), optionalValidDateValidator()],
  },
  {
    controlName: 'fm_payment_terms_default_days_in_jail',
    validators: [Validators.required, Validators.maxLength(5), numericalTextValidator()],
  },
];
