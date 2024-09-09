import { nationalInsuranceNumberValidator } from '@validators';
import { IFinesMacFormControl } from '../../interfaces/fines-mac-form-control.interface';

export const FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER: IFinesMacFormControl = {
  fieldName: 'national_insurance_number',
  validators: [nationalInsuranceNumberValidator()],
};
