import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';
import { IFinesMacOffenceDetailsState } from './fines-mac-offence-details-state.interface';

export interface IFinesMacOffenceDetailsForm extends IAbstractFormBaseForm<IFinesMacOffenceDetailsState> {
  formData: IFinesMacOffenceDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
