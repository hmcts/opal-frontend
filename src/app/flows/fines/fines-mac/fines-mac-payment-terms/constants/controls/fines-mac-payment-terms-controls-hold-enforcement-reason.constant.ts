import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@interfaces/components/abstract';
import { alphabeticalTextValidator } from '@validators';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF: IAbstractFormArrayControlValidation = {
  controlName: 'reason_account_is_on_noenf',
  validators: [Validators.required, Validators.maxLength(28), alphabeticalTextValidator()],
};
