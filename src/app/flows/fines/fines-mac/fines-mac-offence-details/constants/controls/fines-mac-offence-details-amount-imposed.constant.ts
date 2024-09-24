import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { amountValidator } from '@validators/amount/amount.validator';

export const FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_IMPOSED: IAbstractFormArrayControlValidation = {
  controlName: 'amount_imposed',
  validators: [Validators.required, amountValidator(18, 2)],
};
