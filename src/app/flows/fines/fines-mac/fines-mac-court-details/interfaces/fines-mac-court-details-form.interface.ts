import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacCourtDetailsState } from '../interfaces';

export interface IFinesMacCourtDetailsForm extends IAbstractFormBaseForm<IFinesMacCourtDetailsState> {
  formData: IFinesMacCourtDetailsState;
  nestedFlow: boolean;
}
