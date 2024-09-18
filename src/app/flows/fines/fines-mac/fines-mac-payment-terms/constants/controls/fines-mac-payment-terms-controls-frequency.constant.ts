import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_FREQUENCY: IAbstractFormArrayControlValidation = {
  controlName: 'frequency',
  validators: [Validators.required],
};
