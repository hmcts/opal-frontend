import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { dateOfBirthValidator } from '@hmcts/opal-frontend-common/validators/date-of-birth';
import { numericalTextValidator } from '@hmcts/opal-frontend-common/validators/numerical-only';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';

export const FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_payment_terms_suspended_committal_date',
    validators: [Validators.required, dateOfBirthValidator(), optionalValidDateValidator()],
  },
  {
    controlName: 'fm_payment_terms_default_days_in_jail',
    validators: [Validators.required, Validators.maxLength(5), numericalTextValidator()],
  },
];
