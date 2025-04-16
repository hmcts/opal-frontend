import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { twoDecimalPlacesValidator } from '@hmcts/opal-frontend-common/validators/two-decimal-places';

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
