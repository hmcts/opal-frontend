import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';
import { IFinesMacFormControl } from '../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_CONTROLS_FORENAMES: IFinesMacFormControl = {
  fieldName: 'forenames',
  validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
};
