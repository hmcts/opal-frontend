import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacContactDetailsState } from '../interfaces';

export interface IFinesMacContactDetailsForm extends IAbstractFormBaseForm<IFinesMacContactDetailsState> {
  formData: IFinesMacContactDetailsState;
  nestedFlow: boolean;
}
