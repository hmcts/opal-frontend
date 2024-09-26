import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { pastDateValidator } from '@validators/past-date/past-date.validator';
import { IFinesMacPaymentTermsEnforcementActionsOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-enforcment-actions-options-control-validation.interface';
import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators/alphabetical-text/alphabetical-text.validator';

export const FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS_CONTROL_VALIDATION: IFinesMacPaymentTermsEnforcementActionsOptionsControlValidation =
  {
    defendantIsInCustody: {
      fieldsToAdd: [
        {
          controlName: 'fm_payment_terms_earliest_release_date',
          validators: [optionalValidDateValidator(), pastDateValidator()],
        },
        {
          controlName: 'fm_payment_terms_prison_and_prison_number',
          validators: [Validators.maxLength(28), alphabeticalTextValidator()],
        },
      ],
      fieldsToRemove: [
        {
          controlName: 'fm_payment_terms_reason_account_is_on_noenf',
          validators: [Validators.required, Validators.maxLength(28), alphabeticalTextValidator()],
        },
      ],
    },
    holdEnforcementOnAccount: {
      fieldsToAdd: [
        {
          controlName: 'fm_payment_terms_reason_account_is_on_noenf',
          validators: [Validators.required, Validators.maxLength(28), alphabeticalTextValidator()],
        },
      ],
      fieldsToRemove: [
        {
          controlName: 'fm_payment_terms_earliest_release_date',
          validators: [optionalValidDateValidator(), pastDateValidator()],
        },
        {
          controlName: 'fm_payment_terms_prison_and_prison_number',
          validators: [Validators.maxLength(28), alphabeticalTextValidator()],
        },
      ],
    },
  };
