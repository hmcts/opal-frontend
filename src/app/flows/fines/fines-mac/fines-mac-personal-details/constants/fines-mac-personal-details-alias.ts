import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { alphabeticalTextValidator } from 'opal-frontend-common';

export const FINES_MAC_PERSONAL_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_personal_details_alias_forenames',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
  {
    controlName: 'fm_personal_details_alias_surname',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
