import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract';
import { IFinesMacPaymentTermsState } from './fines-mac-payment-terms-state.interface';

export interface IFinesMacPaymentTermsForm extends IAbstractFormBaseForm<IFinesMacPaymentTermsState> {
  formData: IFinesMacPaymentTermsState;
  nestedFlow: boolean;
  status?: string | null;
}
