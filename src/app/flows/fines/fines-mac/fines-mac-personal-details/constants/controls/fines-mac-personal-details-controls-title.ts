import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '../../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE: IAbstractFormArrayControlValidation = {
  controlName: 'title',
  validators: [Validators.required],
};
