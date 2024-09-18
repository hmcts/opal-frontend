import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { numericalTextValidator } from '@validators/numerical-only/numerical-only.validator';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT: IAbstractFormArrayControlValidation = {
  controlName: 'days_in_default',
  validators: [Validators.required, Validators.maxLength(5), numericalTextValidator()],
};
