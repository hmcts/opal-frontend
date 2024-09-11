import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';
import { twoDecimalPlacesValidator } from '@validators';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_LUMP_SUM: IAbstractFormArrayControlValidation = {
  controlName: 'lump_sum',
  validators: [Validators.required, twoDecimalPlacesValidator()],
};
