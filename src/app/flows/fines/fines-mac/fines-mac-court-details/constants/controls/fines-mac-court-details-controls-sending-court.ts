import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_COURT_DETAILS_CONTROLS_SENDING_COURT: IAbstractFormArrayControlValidation = {
  controlName: 'sending_court',
  validators: [Validators.required],
};
