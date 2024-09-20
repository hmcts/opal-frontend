import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_REFERENCE: IAbstractFormArrayControlValidation = {
  controlName: 'employer_reference',
  validators: [Validators.required, Validators.maxLength(20)],
};
