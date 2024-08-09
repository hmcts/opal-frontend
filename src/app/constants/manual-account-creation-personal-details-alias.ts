import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '../validators';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';

export const MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'AliasForenames',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
  {
    controlName: 'AliasSurname',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
