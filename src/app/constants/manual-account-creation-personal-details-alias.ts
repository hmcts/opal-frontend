import { Validators } from '@angular/forms';
import { IFormArrayControlValidation } from '../interfaces/form-array-control-validation.interface';
import { alphabeticalTextValidator } from '../validators';

export const MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS: IFormArrayControlValidation[] = [
  {
    controlName: 'AliasForenames',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
  {
    controlName: 'AliasSurname',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
