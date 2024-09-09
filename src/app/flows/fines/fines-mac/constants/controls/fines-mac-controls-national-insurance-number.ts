import { nationalInsuranceNumberValidator } from '@validators';
import { IFlowFormControl } from '../../../../interfaces/fines-form-control.interface';

export const FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER: IFlowFormControl = {
  fieldName: 'national_insurance_number',
  validators: [nationalInsuranceNumberValidator()],
};
