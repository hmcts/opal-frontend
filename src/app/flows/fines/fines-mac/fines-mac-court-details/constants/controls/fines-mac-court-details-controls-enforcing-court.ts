import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_COURT_DETAILS_CONTROLS_ENFORCING_COURT: IAbstractFormArrayControlValidation = {
  controlName: 'enforcing_court',
  validators: [Validators.required],
};
