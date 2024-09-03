import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacParentGuardianDetailsState } from '../interfaces';
import { FinesMacStatus } from '../../types';

export interface IFinesMacParentGuardianDetailsForm extends IAbstractFormBaseForm<IFinesMacParentGuardianDetailsState> {
  formData: IFinesMacParentGuardianDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
