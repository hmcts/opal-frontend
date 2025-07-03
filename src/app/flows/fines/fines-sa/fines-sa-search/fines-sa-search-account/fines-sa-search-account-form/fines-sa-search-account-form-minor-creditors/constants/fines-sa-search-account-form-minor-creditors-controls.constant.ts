import { FormControl, Validators } from '@angular/forms';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';

const characterValidator = patternValidator(/^[a-zA-Z0-9\s'-]+$/, 'invalidCharacterPattern');

export const FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX = 'fsa_search_account_minor_creditors_';
export const FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS: Record<string, FormControl> = {
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}minor_creditor_type`]: new FormControl<
    string | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}last_name`]: new FormControl<string | null>(null, [
    characterValidator,
    Validators.maxLength(30),
    Validators.nullValidator,
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}last_name_exact_match`]: new FormControl<
    boolean | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}first_names`]: new FormControl<string | null>(null, [
    characterValidator,
    Validators.maxLength(20),
  ]),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}first_names_exact_match`]: new FormControl<
    boolean | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}company_name`]: new FormControl<string | null>(
    null,
    [characterValidator, Validators.maxLength(50)],
  ),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}company_name_exact_match`]: new FormControl<
    boolean | null
  >(null),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}address_line_1`]: new FormControl<string | null>(
    null,
    [characterValidator, Validators.maxLength(30)],
  ),
  [`${FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_CONTROLS_PREFIX}post_code`]: new FormControl<string | null>(null, [
    characterValidator,
    Validators.maxLength(8),
  ]),
};
