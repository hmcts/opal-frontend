import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';
import { IFinesMacFormControl } from '../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_CONTROLS_SURNAME: IFinesMacFormControl = {
  fieldName: 'surname',
  validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
};
