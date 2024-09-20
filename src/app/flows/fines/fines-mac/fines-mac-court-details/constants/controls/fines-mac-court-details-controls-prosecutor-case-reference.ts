import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_COURT_DETAILS_CONTROLS_PROSECUTOR_COURT_REFERENCE: IAbstractFormArrayControlValidation = {
  controlName: 'prosecutor_case_reference',
  validators: [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9 ]*$/)],
};
