import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { alphabeticalTextValidator } from '@validators/alphabetical-text/alphabetical-text.validator';

export const FINES_MAC_COMPANY_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_company_details_alias_company_name',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
