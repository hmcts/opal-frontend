import { Validators } from '@angular/forms';
import { IFormArrayControlValidation } from '@interfaces';
import { alphabeticalTextValidator } from '@validators';

export const MANUAL_ACCOUNT_CREATION_PERSONAL_DETAILS_ALIAS: IFormArrayControlValidation[] = [
  {
    controlName: 'firstNames',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
  {
    controlName: 'lastName',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
