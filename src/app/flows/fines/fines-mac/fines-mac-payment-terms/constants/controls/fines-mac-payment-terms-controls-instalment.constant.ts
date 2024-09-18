import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { twoDecimalPlacesValidator } from '@validators/two-decimal-places/two-decimal-places.validator';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_INSTALMENT: IAbstractFormArrayControlValidation = {
  controlName: 'instalment',
  validators: [Validators.required, twoDecimalPlacesValidator()],
};