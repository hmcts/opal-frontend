import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { SINGLE_ASCII_CHARACTERS } from '@hmcts/opal-frontend-common/constants';

const SINGLE_ASCII_CHARACTERS_ALPHANUMERIC_WITH_SPECIAL_CHARACTERS_PATTERN_VALIDATOR = patternValidator(
  SINGLE_ASCII_CHARACTERS,
  'alphanumericWithSpecialCharacters',
);

export const FINES_MAC_PERSONAL_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_personal_details_alias_forenames',
    validators: [
      Validators.required,
      Validators.maxLength(20),
      SINGLE_ASCII_CHARACTERS_ALPHANUMERIC_WITH_SPECIAL_CHARACTERS_PATTERN_VALIDATOR,
    ],
  },
  {
    controlName: 'fm_personal_details_alias_surname',
    validators: [
      Validators.required,
      Validators.maxLength(30),
      SINGLE_ASCII_CHARACTERS_ALPHANUMERIC_WITH_SPECIAL_CHARACTERS_PATTERN_VALIDATOR,
    ],
  },
];
