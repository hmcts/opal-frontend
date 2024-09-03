import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { FinesMacStatus } from '../../types';
import { IFinesMacPaymentTermsState } from './fines-mac-payment-terms-state.interface';

export interface IFinesMacPaymentTermsForm extends IAbstractFormBaseForm<IFinesMacPaymentTermsState> {
  formData: IFinesMacPaymentTermsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
