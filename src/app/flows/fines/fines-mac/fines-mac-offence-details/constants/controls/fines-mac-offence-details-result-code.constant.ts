import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_OFFENCE_DETAILS_CONTROLS_RESULT_CODE: IAbstractFormArrayControlValidation = {
  controlName: 'result_code',
  validators: [Validators.required],
};
