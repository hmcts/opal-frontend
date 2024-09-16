import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacEmployerDetailsState } from '../interfaces/fines-mac-employer-details-state.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';

export interface IFinesMacEmployerDetailsForm extends IAbstractFormBaseForm<IFinesMacEmployerDetailsState> {
  formData: IFinesMacEmployerDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
