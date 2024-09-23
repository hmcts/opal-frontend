import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_PAID: IAbstractFormArrayControlValidation = {
  controlName: 'amount_paid',
  validators: [Validators.required],
};
