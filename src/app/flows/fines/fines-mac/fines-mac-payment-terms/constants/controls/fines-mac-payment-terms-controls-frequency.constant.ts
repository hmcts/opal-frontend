import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_FREQUENCY: IAbstractFormArrayControlValidation = {
  controlName: 'frequency',
  validators: [Validators.required],
};
