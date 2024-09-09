import { optionalMaxLengthValidator } from '@validators';
import { IFinesMacFormControl } from '../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_CONTROLS_VEHICLE_MAKE: IFinesMacFormControl = {
  fieldName: 'vehicle_make',
  validators: [optionalMaxLengthValidator(30)],
};
