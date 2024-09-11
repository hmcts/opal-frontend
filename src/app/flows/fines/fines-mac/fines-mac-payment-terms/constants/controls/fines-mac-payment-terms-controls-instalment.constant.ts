import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';
import { twoDecimalPlacesValidator } from '@validators';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_INSTALMENT: IAbstractFormArrayControlValidation = {
  controlName: 'instalment',
  validators: [Validators.required, twoDecimalPlacesValidator()],
};
