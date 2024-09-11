import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';
import { optionalValidDateValidator } from '@validators';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_START_DATE: IAbstractFormArrayControlValidation = {
  controlName: 'start_date',
  validators: [Validators.required, optionalValidDateValidator()],
};
