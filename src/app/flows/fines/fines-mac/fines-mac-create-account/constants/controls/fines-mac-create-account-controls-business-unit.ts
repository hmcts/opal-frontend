import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CREATE_ACCOUNT_CONTROLS_BUSINESS_UNIT: IAbstractFormArrayControlValidation = {
  controlName: 'business_unit',
  validators: [Validators.required],
};
