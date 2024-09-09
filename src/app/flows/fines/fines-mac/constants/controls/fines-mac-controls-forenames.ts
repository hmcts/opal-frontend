import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';
import { IFlowFormControl } from '../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_CONTROLS_FORENAMES: IFlowFormControl = {
  fieldName: 'forenames',
  validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
};
