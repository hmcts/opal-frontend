import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';
import { alphabeticalTextValidator } from '@validators';

export const FINES_MAC_COMPANY_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'AliasOrganisationName',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
