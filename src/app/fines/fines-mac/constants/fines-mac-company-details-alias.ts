import { Validators } from '@angular/forms';
import { IFormArrayControlValidation } from '@interfaces';
import { alphabeticalTextValidator } from '@validators';

export const FINES_MAC_COMPANY_DETAILS_ALIAS: IFormArrayControlValidation[] = [
  {
    controlName: 'companyName',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
