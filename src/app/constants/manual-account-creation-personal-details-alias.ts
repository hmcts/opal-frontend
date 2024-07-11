import { Validators } from '@angular/forms';
import { IFormAliasConfigurationValidation } from '../interfaces/form-alias-configuration-validation.interface';
import { alphabeticalTextValidator } from '../validators';

export const MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS: IFormAliasConfigurationValidation[] = [
  {
    controlName: 'firstNames',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
  {
    controlName: 'lastName',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
