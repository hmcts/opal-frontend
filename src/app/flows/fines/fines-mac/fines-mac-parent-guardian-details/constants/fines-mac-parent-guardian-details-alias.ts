import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { alphabeticalTextValidator } from '@hmcts/opal-frontend-common/validators/alphabetical-text';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_parent_guardian_details_alias_forenames',
    validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
  },
  {
    controlName: 'fm_parent_guardian_details_alias_surname',
    validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
  },
];
