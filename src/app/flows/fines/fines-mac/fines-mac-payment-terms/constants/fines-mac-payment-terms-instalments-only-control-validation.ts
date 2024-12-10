import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';
import { twoDecimalPlacesValidator } from '@validators/two-decimal-places/two-decimal-places.validator';

export const FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_payment_terms_instalment_amount',
    validators: [Validators.required, twoDecimalPlacesValidator()],
  },
  {
    controlName: 'fm_payment_terms_instalment_period',
    validators: [Validators.required],
  },
  {
    controlName: 'fm_payment_terms_start_date',
    validators: [Validators.required, optionalValidDateValidator()],
  },
];
