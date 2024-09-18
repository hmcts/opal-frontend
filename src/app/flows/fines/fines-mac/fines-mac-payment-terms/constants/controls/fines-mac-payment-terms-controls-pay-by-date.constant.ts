import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalValidDateValidator } from '@validators/optional-valid-date/optional-valid-date.validator';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_PAY_BY_DATE: IAbstractFormArrayControlValidation = {
  controlName: 'pay_by_date',
  validators: [Validators.required, optionalValidDateValidator()],
};
