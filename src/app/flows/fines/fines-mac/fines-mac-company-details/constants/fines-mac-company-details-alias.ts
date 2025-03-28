import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract';
import { alphabeticalTextValidator } from '@hmcts/opal-frontend-common/validators';

export const FINES_MAC_COMPANY_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_company_details_alias_company_name',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
