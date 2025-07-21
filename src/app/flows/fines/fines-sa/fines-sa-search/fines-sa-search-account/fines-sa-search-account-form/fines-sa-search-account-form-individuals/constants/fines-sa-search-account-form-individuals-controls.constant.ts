import { FormControl, Validators } from '@angular/forms';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_PATTERN,
  LETTERS_SPACES_HYPHENS_APOSTROPHES_PATTERN,
} from '../../../../../../constants/fines-patterns.constant';

const characterValidator = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_PATTERN,
  'invalidCharacterPattern',
);
const nameValidator = patternValidator(LETTERS_SPACES_HYPHENS_APOSTROPHES_PATTERN, 'invalidNamePattern');

export const FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX = 'fsa_search_account_individuals_';
export const FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS: Record<string, FormControl> = {
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX}last_name`]: new FormControl<string | null>(null, [
    nameValidator,
    Validators.maxLength(30),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX}last_name_exact_match`]: new FormControl<boolean | null>(
    null,
  ),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX}first_names`]: new FormControl<string | null>(null, [
    nameValidator,
    Validators.maxLength(20),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX}first_names_exact_match`]: new FormControl<
    boolean | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX}include_aliases`]: new FormControl<boolean | null>(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX}date_of_birth`]: new FormControl<string | null>(null, [
    optionalValidDateValidator(),
    dateOfBirthValidator(),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX}national_insurance_number`]: new FormControl<
    string | null
  >(null, [characterValidator, Validators.maxLength(9)]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX}address_line_1`]: new FormControl<string | null>(null, [
    characterValidator,
    Validators.maxLength(30),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_CONTROLS_PREFIX}post_code`]: new FormControl<string | null>(null, [
    characterValidator,
    Validators.maxLength(8),
  ]),
};
