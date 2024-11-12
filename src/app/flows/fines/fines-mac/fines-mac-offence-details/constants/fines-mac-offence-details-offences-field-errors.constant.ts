import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export const FINES_MAC_OFFENCE_DETAILS_OFFENCES_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  fm_offence_details_date_of_sentence: {
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
      message: 'Sentence date must not be in the future',
      priority: 4,
    },
  },
  fm_offence_details_offence_id: {
    required: {
      message: 'Enter an offence code',
      priority: 1,
    },
    invalidOffenceCode: {
      message: 'Offence not found',
      priority: 2,
    },
  },
};
