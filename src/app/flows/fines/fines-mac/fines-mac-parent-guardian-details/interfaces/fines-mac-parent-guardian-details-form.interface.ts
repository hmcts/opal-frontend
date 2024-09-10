import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacParentGuardianDetailsState } from '../interfaces/fines-mac-parent-guardian-details-state.interface';
import { FinesMacStatus } from '../../types';

export interface IFinesMacParentGuardianDetailsForm extends IAbstractFormBaseForm<IFinesMacParentGuardianDetailsState> {
  formData: IFinesMacParentGuardianDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
