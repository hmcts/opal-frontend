import { Validators } from '@angular/forms';
import { IFormArrayControlValidation } from '@interfaces';
import { alphabeticalTextValidator } from 'src/app/validators';

export const MANUAL_ACCOUNT_CREATION_COMPANY_DETAILS_ALIAS: IFormArrayControlValidation[] = [
  {
    controlName: 'companyName',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
