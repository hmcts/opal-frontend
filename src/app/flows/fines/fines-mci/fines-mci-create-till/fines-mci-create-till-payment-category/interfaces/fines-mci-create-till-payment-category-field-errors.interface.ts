import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesMciCreateTillPaymentCategoryFieldErrors extends IAbstractFormBaseFieldErrors {
  paymentCategory: {
    required: {
      message: string;
      priority: number;
    };
  };
}
