import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { SINGLE_ASCII_CHARACTERS } from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';

const SINGLE_ASCII_CHARACTERS_ALPHANUMERIC_WITH_SPECIAL_CHARACTERS_PATTERN_VALIDATOR = patternValidator(
  SINGLE_ASCII_CHARACTERS,
  'alphanumericWithSpecialCharacters',
);

export const FINES_MAC_COMPANY_DETAILS_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_company_details_alias_company_name',
    validators: [
      Validators.required,
      Validators.maxLength(30),
      SINGLE_ASCII_CHARACTERS_ALPHANUMERIC_WITH_SPECIAL_CHARACTERS_PATTERN_VALIDATOR,
    ],
  },
];
