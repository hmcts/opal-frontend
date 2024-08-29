import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacPersonalDetailsState } from '../interfaces/fines-mac-personal-details-state.interface';
import { FinesMacStatus } from '../../types';

export interface IFinesMacPersonalDetailsForm extends IAbstractFormBaseForm<IFinesMacPersonalDetailsState> {
  formData: IFinesMacPersonalDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
