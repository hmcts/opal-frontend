import { Validators } from '@angular/forms';
import { IFinesMacFormControl } from '../../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE: IFinesMacFormControl = {
  fieldName: 'title',
  validators: [Validators.required],
};
