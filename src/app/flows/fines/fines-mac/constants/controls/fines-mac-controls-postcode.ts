import { optionalMaxLengthValidator } from '@validators';
import { IFlowFormControl } from '../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_CONTROLS_POSTCODE: IFlowFormControl = {
  fieldName: 'postcode',
  validators: [optionalMaxLengthValidator(8)],
};
