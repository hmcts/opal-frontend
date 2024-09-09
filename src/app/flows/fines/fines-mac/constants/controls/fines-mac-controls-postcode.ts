import { optionalMaxLengthValidator } from '@validators';
import { IFinesMacFormControl } from '../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_CONTROLS_POSTCODE: IFinesMacFormControl = {
  fieldName: 'postcode',
  validators: [optionalMaxLengthValidator(8)],
};
