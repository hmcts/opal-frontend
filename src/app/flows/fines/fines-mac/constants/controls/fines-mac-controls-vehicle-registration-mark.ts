import { optionalMaxLengthValidator } from '@validators';
import { IFlowFormControl } from '../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK: IFlowFormControl = {
  fieldName: 'vehicle_registration_mark',
  validators: [optionalMaxLengthValidator(11)],
};
