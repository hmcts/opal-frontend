import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';
import { IFinesMacFormState } from '../../interfaces/fines-mac-form-state.interface';

export interface IFinesMacPaymentTermsForm extends IAbstractFormBaseForm<IFinesMacFormState> {
  formData: IFinesMacFormState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
