import { FormControl, FormGroup, Validators } from '@angular/forms';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN,
} from '@hmcts/opal-frontend-common/constants';

const characterValidator = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'invalidCharacterPattern',
);
const nameValidator = patternValidator(LETTERS_SPACES_HYPHENS_APOSTROPHES_DOT_PATTERN, 'invalidNamePattern');

export const FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX = 'fsa_search_account_minor_creditors_';

export const FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS = new FormGroup({
  [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'minor_creditor_type']: new FormControl<
    string | null
  >(null, [Validators.nullValidator]),
  [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'individual']: new FormGroup({
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'last_name']: new FormControl<string | null>(null, [
      nameValidator,
      Validators.maxLength(30),
    ]),
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'last_name_exact_match']: new FormControl<
      boolean | null
    >(null),
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'first_names']: new FormControl<string | null>(
      null,
      [nameValidator, Validators.maxLength(20)],
    ),
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'first_names_exact_match']: new FormControl<
      boolean | null
    >(null),
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'individual_address_line_1']: new FormControl<
      string | null
    >(null, [characterValidator, Validators.maxLength(30)]),
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'individual_post_code']: new FormControl<
      string | null
    >(null, [characterValidator, Validators.maxLength(8)]),
  }),
  [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'company']: new FormGroup({
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'company_name']: new FormControl<string | null>(
      null,
      [nameValidator, Validators.maxLength(50)],
    ),
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'company_name_exact_match']: new FormControl<
      boolean | null
    >(null),
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'company_address_line_1']: new FormControl<
      string | null
    >(null, [characterValidator, Validators.maxLength(30)]),
    [FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX + 'company_post_code']: new FormControl<
      string | null
    >(null, [characterValidator, Validators.maxLength(8)]),
  }),
});
