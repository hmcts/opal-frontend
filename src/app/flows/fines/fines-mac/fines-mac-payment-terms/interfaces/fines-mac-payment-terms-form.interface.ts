import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';
import { IFinesMacPaymentTermsState } from './fines-mac-payment-terms-state.interface';

export interface IFinesMacPaymentTermsForm extends IAbstractFormBaseForm<IFinesMacPaymentTermsState> {
  formData: IFinesMacPaymentTermsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
