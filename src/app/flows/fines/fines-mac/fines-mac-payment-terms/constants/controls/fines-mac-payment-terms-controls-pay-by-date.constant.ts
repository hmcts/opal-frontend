import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';
import { optionalValidDateValidator } from '@validators';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_PAY_BY_DATE: IAbstractFormArrayControlValidation = {
  controlName: 'pay_by_date',
  validators: [Validators.required, optionalValidDateValidator()],
};
