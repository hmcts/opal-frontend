import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_MCI_CREATE_TILL_COURT_FEE_PAYMENT_DETAILS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  paymentReceivedFrom: {
    required: { message: 'Select who the payment was received from', priority: 1 },
  },
};
