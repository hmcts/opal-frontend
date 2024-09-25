import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER } from '../../../constants/controls/fines-mac-controls-national-insurance-number';

export const FINES_MAC_NATIONAL_INSURANCE_NUMBER_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER.controlName]: {
    nationalInsuranceNumberPattern: {
      message: `Enter a National Insurance number in the format AANNNNNNA`,
      priority: 1,
    },
  },
};
