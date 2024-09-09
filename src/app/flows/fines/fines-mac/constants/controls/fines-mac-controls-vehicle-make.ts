import { optionalMaxLengthValidator } from '@validators';
import { IFlowFormControl } from '../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_CONTROLS_VEHICLE_MAKE: IFlowFormControl = {
  fieldName: 'vehicle_make',
  validators: [optionalMaxLengthValidator(30)],
};
