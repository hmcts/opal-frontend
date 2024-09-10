import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';
import { IAbstractFormArrayControlValidation } from '../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_SURNAME: IAbstractFormArrayControlValidation = {
  controlName: 'surname',
  validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
};
