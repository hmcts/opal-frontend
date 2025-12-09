import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccPaymentTermsAmendState } from './fines-acc-payment-terms-amend-state.interface';

export interface IFinesAccPaymentTermsAmendForm extends IAbstractFormBaseForm<IFinesAccPaymentTermsAmendState> {
  formData: IFinesAccPaymentTermsAmendState;
  nestedFlow: boolean;
}
