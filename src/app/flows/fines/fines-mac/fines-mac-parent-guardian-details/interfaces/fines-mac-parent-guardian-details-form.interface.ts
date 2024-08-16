import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacParentGuardianDetailsState } from '../interfaces';

export interface IFinesMacParentGuardianDetailsForm extends IAbstractFormBaseForm<IFinesMacParentGuardianDetailsState> {
  formData: IFinesMacParentGuardianDetailsState;
  nestedFlow: boolean;
}
