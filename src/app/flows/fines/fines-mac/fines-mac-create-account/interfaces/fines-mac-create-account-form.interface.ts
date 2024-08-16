import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacCreateAccountState } from './fines-mac-create-account-state.interface';

export interface IFinesMacCreateAccountForm extends IAbstractFormBaseForm<IFinesMacCreateAccountState> {
  formData: IFinesMacCreateAccountState;
  nestedFlow: boolean;
}
