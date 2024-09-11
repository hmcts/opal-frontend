import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';
import { numericalTextValidator } from '@validators';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT: IAbstractFormArrayControlValidation = {
  controlName: 'days_in_default',
  validators: [Validators.required, Validators.maxLength(5), numericalTextValidator()],
};
