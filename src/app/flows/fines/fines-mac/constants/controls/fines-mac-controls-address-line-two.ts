import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';
import { IFlowFormControl } from '../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_TWO: IFlowFormControl = {
  fieldName: 'address_line_2',
  validators: [optionalMaxLengthValidator(30), specialCharactersValidator()],
};
