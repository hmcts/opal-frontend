import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacEmployerDetailsState } from '../interfaces';
import { FinesMacStatus } from '../../types';

export interface IFinesMacEmployerDetailsForm extends IAbstractFormBaseForm<IFinesMacEmployerDetailsState> {
  formData: IFinesMacEmployerDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
