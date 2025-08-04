import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { LETTERS_WITH_SPACES_PATTERN } from '@hmcts/opal-frontend-common/constants/regex-patterns';

// regex pattern validator for letters with spaces
const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'alphabeticalTextPattern');

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_parent_guardian_details_alias_forenames',
    validators: [Validators.required, Validators.maxLength(20), LETTERS_WITH_SPACES_PATTERN_VALIDATOR],
  },
  {
    controlName: 'fm_parent_guardian_details_alias_surname',
    validators: [Validators.required, Validators.maxLength(30), LETTERS_WITH_SPACES_PATTERN_VALIDATOR],
  },
];
