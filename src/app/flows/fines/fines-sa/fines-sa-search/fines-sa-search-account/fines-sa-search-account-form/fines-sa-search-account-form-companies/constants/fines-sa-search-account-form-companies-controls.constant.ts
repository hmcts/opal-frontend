import { FormControl, Validators } from '@angular/forms';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  ALPHANUMERIC_WITH_SPACES_PATTERN,
} from '@hmcts/opal-frontend-common/constants';

const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);
const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericWithHyphensSpacesApostrophesDotPattern',
);

export const FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX = 'fsa_search_account_companies_';

export const FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS: Record<string, FormControl> = {
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}company_name`]: new FormControl<string | null>(null, [
    ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
    Validators.maxLength(50),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}company_name_exact_match`]: new FormControl<
    boolean | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}include_aliases`]: new FormControl<boolean | null>(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}address_line_1`]: new FormControl<string | null>(null, [
    ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
    Validators.maxLength(30),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}post_code`]: new FormControl<string | null>(null, [
    ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR,
    Validators.maxLength(8),
  ]),
};
