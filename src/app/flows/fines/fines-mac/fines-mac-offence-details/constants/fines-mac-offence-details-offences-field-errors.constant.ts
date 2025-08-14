import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

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
      message: 'Enter a valid date',
      priority: 3,
    },
    invalidFutureDate: {
      message: 'Sentence date must not be in the future',
      priority: 4,
    },
  },
  fm_offence_details_offence_cjs_code: {
    required: {
      message: 'Enter an offence code',
      priority: 1,
    },
    alphanumericTextPattern: {
      message: 'Offence code must only contain letters or numbers',
      priority: 2,
    },
    maxlength: {
      message: 'Offence code must be 7 or 8 characters',
      priority: 3,
    },
    minlength: {
      message: 'Offence code must be 7 or 8 characters',
      priority: 4,
    },
    invalidOffenceCode: {
      message: 'Offence not found',
      priority: 5,
    },
  },
};
