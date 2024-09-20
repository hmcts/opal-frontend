import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_COMPANY_NAME: IAbstractFormArrayControlValidation = {
  controlName: 'employer_company_name',
  validators: [Validators.required, Validators.maxLength(35)],
};
