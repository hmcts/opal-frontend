import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { LETTERS_WITH_SPACES_PATTERN } from '../../../constants/fines-patterns.constant';

export const FINES_MAC_PERSONAL_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_personal_details_alias_forenames',
    validators: [Validators.required, Validators.maxLength(20), patternValidator(LETTERS_WITH_SPACES_PATTERN)],
  },
  {
    controlName: 'fm_personal_details_alias_surname',
    validators: [Validators.required, Validators.maxLength(30), patternValidator(LETTERS_WITH_SPACES_PATTERN)],
  },
];
