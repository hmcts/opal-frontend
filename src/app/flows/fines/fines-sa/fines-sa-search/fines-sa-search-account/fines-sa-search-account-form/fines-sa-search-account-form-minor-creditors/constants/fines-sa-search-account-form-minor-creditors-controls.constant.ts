import { FormControl, Validators } from '@angular/forms';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  LETTERS_WITH_SPACES_PATTERN,
} from '@hmcts/opal-frontend-common/constants';

const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);
const LETTERS_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(LETTERS_WITH_SPACES_PATTERN, 'lettersWithSpacesPattern');
const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericWithHyphensSpacesApostrophesDotPattern',
);

export const FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX = 'fsa_search_account_minor_creditors_';
export const FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS: Record<string, FormControl> = {
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}minor_creditor_type`]: new FormControl<
    string | null
  >(null, [Validators.nullValidator]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}last_name`]: new FormControl<string | null>(null, [
    LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
    Validators.maxLength(30),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}last_name_exact_match`]: new FormControl<
    boolean | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}first_names`]: new FormControl<string | null>(null, [
    LETTERS_WITH_SPACES_PATTERN_VALIDATOR,
    Validators.maxLength(20),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}first_names_exact_match`]: new FormControl<
    boolean | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}company_name`]: new FormControl<string | null>(
    null,
    [ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR, Validators.maxLength(50)],
  ),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}company_name_exact_match`]: new FormControl<
    boolean | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}individual_address_line_1`]: new FormControl<
    string | null
  >(null, [ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR, Validators.maxLength(30)]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}individual_post_code`]: new FormControl<
    string | null
  >(null, [ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR, Validators.maxLength(8)]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}company_address_line_1`]: new FormControl<
    string | null
  >(null, [ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR, Validators.maxLength(30)]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}company_post_code`]: new FormControl<string | null>(
    null,
    [ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR, Validators.maxLength(8)],
  ),
};
