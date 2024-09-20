import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_ENFORCEMENT_ACTIONS: IAbstractFormArrayControlValidation = {
  controlName: 'enforcement_actions',
  validators: [Validators.required],
};
