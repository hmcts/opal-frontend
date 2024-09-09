import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';
import { IFinesMacFormControl } from '../../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE: IFinesMacFormControl = {
  fieldName: 'address_line_3',
  validators: [optionalMaxLengthValidator(16), specialCharactersValidator()],
};
