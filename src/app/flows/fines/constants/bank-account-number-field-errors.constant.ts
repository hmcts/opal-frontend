import { IAbstractFormBaseFieldError } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const BANK_ACCOUNT_NUMBER_FIELD_ERRORS: IAbstractFormBaseFieldError = {
  minlength: {
    message: 'Account number must be between 6 and 8 numbers',
    priority: 2,
  },
  maxlength: {
    message: 'Account number must be between 6 and 8 numbers',
    priority: 3,
  },
  numericalTextPattern: {
    message: 'Account number must be between 6 and 8 numbers',
    priority: 4,
  },
};
