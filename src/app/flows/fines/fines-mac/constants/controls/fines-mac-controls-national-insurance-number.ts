import { nationalInsuranceNumberValidator } from '@validators';

export const FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER = {
  controlName: 'national_insurance_number',
  initialValue: null,
  validators: [nationalInsuranceNumberValidator()],
};
