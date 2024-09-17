import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators/alphabetical-text/alphabetical-text.validator';
import { IFinesMacNameAliasControlValidation } from '../interfaces';

export const FINES_MAC_NAME_ALIAS: IFinesMacNameAliasControlValidation[] = [
  {
    controlName: 'alias_forenames',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
  {
    controlName: 'alias_surname',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
