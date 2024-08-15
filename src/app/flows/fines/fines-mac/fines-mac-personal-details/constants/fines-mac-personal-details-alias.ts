import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';
import { alphabeticalTextValidator } from '@validators';

export const FINES_MAC_PERSONAL_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'AliasForenames',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
  {
    controlName: 'AliasSurname',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
