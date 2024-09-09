import { Validators } from '@angular/forms';
import { specialCharactersValidator } from '@validators';
import { IFinesMacFormControl } from '../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_ONE: IFinesMacFormControl = {
  fieldName: 'address_line_1',
  validators: [Validators.required, Validators.maxLength(30), specialCharactersValidator()],
};
