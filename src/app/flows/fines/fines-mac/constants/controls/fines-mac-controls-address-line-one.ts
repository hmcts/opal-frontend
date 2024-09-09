import { Validators } from '@angular/forms';
import { specialCharactersValidator } from '@validators';
import { IFlowFormControl } from '../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_ONE: IFlowFormControl = {
  fieldName: 'address_line_1',
  validators: [Validators.required, Validators.maxLength(30), specialCharactersValidator()],
};
