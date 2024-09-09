import { nationalInsuranceNumberValidator } from '@validators';

export const FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER = {
  fieldName: 'national_insurance_number',
  validators: [nationalInsuranceNumberValidator()],
};
