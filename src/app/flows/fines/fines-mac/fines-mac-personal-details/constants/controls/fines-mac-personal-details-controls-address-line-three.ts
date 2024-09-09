import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';
import { IFlowFormControl } from '../../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE: IFlowFormControl = {
  fieldName: 'address_line_3',
  validators: [optionalMaxLengthValidator(16), specialCharactersValidator()],
};
