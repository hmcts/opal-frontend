import { optionalMaxLengthValidator } from '@validators';
import { IFinesMacFormControl } from '../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK: IFinesMacFormControl = {
  fieldName: 'vehicle_registration_mark',
  validators: [optionalMaxLengthValidator(11)],
};
