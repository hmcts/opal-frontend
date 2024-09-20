import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CREATE_ACCOUNT_CONTROLS_ACCOUNT_TYPE: IAbstractFormArrayControlValidation = {
  controlName: 'account_type',
  validators: [Validators.required],
};
