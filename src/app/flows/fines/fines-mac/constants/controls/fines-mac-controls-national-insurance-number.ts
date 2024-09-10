import { nationalInsuranceNumberValidator } from '@validators';
import { IAbstractFormArrayControlValidation } from '../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER: IAbstractFormArrayControlValidation = {
  controlName: 'national_insurance_number',
  validators: [nationalInsuranceNumberValidator()],
};
