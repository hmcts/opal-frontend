import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { pastDateValidator } from '@hmcts/opal-frontend-common/validators/past-date';
import { IFinesMacPaymentTermsEnforcementActionsOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-enforcment-actions-options-control-validation.interface';
import { Validators } from '@angular/forms';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import {
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
} from '@hmcts/opal-frontend-common/constants';

// regex pattern validators for the form controls
const ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);
const ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN,
  'alphanumericTextPattern',
);

export const FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS_CONTROL_VALIDATION: IFinesMacPaymentTermsEnforcementActionsOptionsControlValidation =
  {
    PRIS: {
      fieldsToAdd: [
        {
          controlName: 'fm_payment_terms_earliest_release_date',
          validators: [optionalValidDateValidator(), pastDateValidator()],
        },
        {
          controlName: 'fm_payment_terms_prison_and_prison_number',
          validators: [Validators.maxLength(28), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR],
        },
      ],
      fieldsToRemove: [
        {
          controlName: 'fm_payment_terms_reason_account_is_on_noenf',
          validators: [
            Validators.required,
            Validators.maxLength(28),
            ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
          ],
        },
      ],
    },
    NOENF: {
      fieldsToAdd: [
        {
          controlName: 'fm_payment_terms_reason_account_is_on_noenf',
          validators: [
            Validators.required,
            Validators.maxLength(28),
            ALPHANUMERIC_WITH_HYPHENS_SPACES_APOSTROPHES_DOT_PATTERN_VALIDATOR,
          ],
        },
      ],
      fieldsToRemove: [
        {
          controlName: 'fm_payment_terms_earliest_release_date',
          validators: [optionalValidDateValidator(), pastDateValidator()],
        },
        {
          controlName: 'fm_payment_terms_prison_and_prison_number',
          validators: [Validators.maxLength(28), ALPHANUMERIC_WITH_SPACES_PATTERN_VALIDATOR],
        },
      ],
    },
  };
