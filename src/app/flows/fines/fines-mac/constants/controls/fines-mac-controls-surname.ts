import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';
import { IFlowFormControl } from '../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_CONTROLS_SURNAME: IFlowFormControl = {
  fieldName: 'surname',
  validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
};
