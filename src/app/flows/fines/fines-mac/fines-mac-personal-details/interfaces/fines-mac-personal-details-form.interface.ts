import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacPersonalDetailsState } from '../interfaces/fines-mac-personal-details-state.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';

export interface IFinesMacPersonalDetailsForm extends IAbstractFormBaseForm<IFinesMacPersonalDetailsState> {
  formData: IFinesMacPersonalDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
