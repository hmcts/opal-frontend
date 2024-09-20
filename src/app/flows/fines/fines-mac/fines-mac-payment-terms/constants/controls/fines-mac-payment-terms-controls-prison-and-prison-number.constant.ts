import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { alphabeticalTextValidator } from '@validators/alphabetical-text/alphabetical-text.validator';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_PRISON_AND_PRISON_NUMBER: IAbstractFormArrayControlValidation = {
  controlName: 'prison_and_prison_number',
  validators: [Validators.maxLength(28), alphabeticalTextValidator()],
};
