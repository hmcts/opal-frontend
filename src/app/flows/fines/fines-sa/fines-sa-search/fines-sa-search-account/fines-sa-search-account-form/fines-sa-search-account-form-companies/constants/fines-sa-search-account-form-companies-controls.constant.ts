import { FormControl, Validators } from '@angular/forms';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_PATTERN,
  LETTERS_SPACES_HYPHENS_APOSTROPHES_PATTERN,
} from 'src/app/flows/fines/constants/fines-patterns.constant';

const characterValidator = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_PATTERN,
  'invalidCharacterPattern',
);
const nameValidator = patternValidator(LETTERS_SPACES_HYPHENS_APOSTROPHES_PATTERN, 'invalidNamePattern');

export const FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX = 'fsa_search_account_companies_';

export const FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS: Record<string, FormControl> = {
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}company_name`]: new FormControl<string | null>(null, [
    nameValidator,
    Validators.maxLength(50),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}company_name_exact_match`]: new FormControl<
    boolean | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}include_aliases`]: new FormControl<boolean | null>(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}address_line_1`]: new FormControl<string | null>(null, [
    characterValidator,
    Validators.maxLength(30),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_CONTROLS_PREFIX}post_code`]: new FormControl<string | null>(null, [
    characterValidator,
    Validators.maxLength(8),
  ]),
};
