import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_ACC_APR_ADD_CHANGE_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  apr_text: {
    required: { message: 'Enter a payment reference', priority: 1 },
    maxlength: { message: 'Payment reference must be 18 characters or fewer', priority: 2 },
  },
};
