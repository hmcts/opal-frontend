import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacCourtDetailsState } from '../interfaces';
import { FinesMacStatus } from '../../types';

export interface IFinesMacCourtDetailsForm extends IAbstractFormBaseForm<IFinesMacCourtDetailsState> {
  formData: IFinesMacCourtDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
