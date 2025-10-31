import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN } from '@hmcts/opal-frontend-common/constants';

const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericWithHyphensSpacesApostrophesDotPattern',
);

export const FINES_ACC_PARTY_ADD_AMEND_CONVERT_COMPANY_ALIAS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'facc_party_add_amend_convert_alias_organisation_name',
    validators: [
      Validators.maxLength(30),
      Validators.required,
      ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
    ],
  },
];
