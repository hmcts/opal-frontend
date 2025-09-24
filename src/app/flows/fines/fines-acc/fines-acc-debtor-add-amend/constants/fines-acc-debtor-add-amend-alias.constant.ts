import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { LETTERS_WITH_SPACES_PATTERN } from '@hmcts/opal-frontend-common/constants';

const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'lettersWithSpacesPattern');

export const FINES_ACC_DEBTOR_ADD_AMEND_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'facc_debtor_add_amend_alias_forenames',
    validators: [Validators.maxLength(20), LETTERS_WITH_SPACES_PATTERN_VALIDATOR],
  },
  {
    controlName: 'facc_debtor_add_amend_alias_surname',
    validators: [Validators.maxLength(30), LETTERS_WITH_SPACES_PATTERN_VALIDATOR],
  },
];
