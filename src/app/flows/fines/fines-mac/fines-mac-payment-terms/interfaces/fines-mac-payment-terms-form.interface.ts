import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacPaymentTermsState } from './fines-mac-payment-terms-state.interface';

export interface IFinesMacPaymentTermsForm extends IAbstractFormBaseForm<IFinesMacPaymentTermsState> {
  formData: IFinesMacPaymentTermsState;
  nestedFlow: boolean;
}
