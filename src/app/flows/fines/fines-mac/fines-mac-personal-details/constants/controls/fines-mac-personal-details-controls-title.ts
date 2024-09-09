import { Validators } from '@angular/forms';
import { IFlowFormControl } from '../../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE: IFlowFormControl = {
  fieldName: 'title',
  validators: [Validators.required],
};
