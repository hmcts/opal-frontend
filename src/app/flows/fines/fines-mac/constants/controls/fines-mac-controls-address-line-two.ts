import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';
import { IFinesMacFormControl } from '../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_TWO: IFinesMacFormControl = {
  fieldName: 'address_line_2',
  validators: [optionalMaxLengthValidator(30), specialCharactersValidator()],
};
