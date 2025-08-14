import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { LETTERS_WITH_SPACES_DOT_PATTERN } from '@hmcts/opal-frontend-common/constants';

//regex pattern validator for company names that allows letters, spaces, dots.
const LETTERS_WITH_SPACES_DOT_PATTERN_VALIDATOR = patternValidator(
  LETTERS_WITH_SPACES_DOT_PATTERN,
  'lettersWithSpacesDotPattern',
);

export const FINES_MAC_COMPANY_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_company_details_alias_company_name',
    validators: [Validators.required, Validators.maxLength(30), LETTERS_WITH_SPACES_DOT_PATTERN_VALIDATOR],
  },
];
