import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacParentGuardianDetailsState } from '../interfaces/fines-mac-parent-guardian-details-state.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';

export interface IFinesMacParentGuardianDetailsForm extends IAbstractFormBaseForm<IFinesMacParentGuardianDetailsState> {
  formData: IFinesMacParentGuardianDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
