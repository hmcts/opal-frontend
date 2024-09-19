import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_PAYMENT_TERMS_CONTROLS_HAS_COLLECTION_ORDER: IAbstractFormArrayControlValidation = {
  controlName: 'has_collection_order',
  validators: [Validators.required],
};
