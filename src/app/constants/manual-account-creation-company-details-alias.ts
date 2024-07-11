import { Validators } from '@angular/forms';
import { IFormAliasConfigurationValidation } from '../interfaces/form-alias-configuration-validation.interface';
import { alphabeticalTextValidator } from '../validators';

export const MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_ALIAS: IFormAliasConfigurationValidation[] = [
  {
    controlName: 'companyName',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
];
