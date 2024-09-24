import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_OFFENCE_CODE as F_M_O_D_C_OFFENCE_CODE } from './controls/fines-mac-offence-details-offence-code.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_DATE_OF_SENTENCE as F_M_O_D_C_DATE_OF_SENTENCE } from './controls/fines-mac-offence-details-date-of-sentence.constant';

export const FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_O_D_C_DATE_OF_SENTENCE.controlName]: {
    required: {
      message: 'Enter sentence date',
      priority: 1,
    },
    invalidDateFormat: {
      message: 'Enter date of sentence in the format DD/MM/YYYY',
      priority: 2,
    },
    invalidDate: {
      message: 'Enter a valid date of sentence',
      priority: 3,
    },
    invalidFutureDate: {
      message: 'Enter a valid date of sentence in the past',
      priority: 4,
    },
  },
  [F_M_O_D_C_OFFENCE_CODE.controlName]: {
    required: {
      message: 'Enter an offence code',
      priority: 1,
    },
  },
};
