import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacEmployerDetailsState } from '../interfaces';

export interface IFinesMacEmployerDetailsForm extends IAbstractFormBaseForm<IFinesMacEmployerDetailsState> {
  formData: IFinesMacEmployerDetailsState;
  nestedFlow: boolean;
}
