import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';

export const FINES_MAC_PAYMENT_TERMS_PAY_IN_FULL_CONTROL_VALIDATION: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_payment_terms_pay_by_date',
    validators: [Validators.required, optionalValidDateValidator()],
  },
];
