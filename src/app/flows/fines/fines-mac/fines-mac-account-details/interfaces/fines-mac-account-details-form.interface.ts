import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacAccountDetailsState } from './fines-mac-account-details-state.interface';

export interface IFinesMacAccountDetailsForm extends IAbstractFormBaseForm<IFinesMacAccountDetailsState> {
  formData: IFinesMacAccountDetailsState;
  nestedFlow: boolean;
}
