import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';
import { IFinesMacNameAliasControlValidation } from '../interfaces';

export const FINES_MAC_NAME_ALIAS: IFinesMacNameAliasControlValidation[] = [
  {
    controlName: 'AliasForenames',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
  {
    controlName: 'AliasSurname',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
