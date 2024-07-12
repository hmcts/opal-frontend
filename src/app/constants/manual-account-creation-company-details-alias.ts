import { Validators } from '@angular/forms';
import { IFormArrayControlValidation } from '../interfaces/form-array-control-validation.interface';
import { alphabeticalTextValidator } from '../validators';

export const MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_ALIAS: IFormArrayControlValidation[] = [
  {
    controlName: 'companyName',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
];
