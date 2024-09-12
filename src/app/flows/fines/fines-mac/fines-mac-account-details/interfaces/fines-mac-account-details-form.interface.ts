import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { FinesMacStatus } from '../../types/fines-mac-status.type';
import { IFinesMacAccountDetailsState } from './fines-mac-account-details-state.interface';

export interface IFinesMacAccountDetailsForm extends IAbstractFormBaseForm<IFinesMacAccountDetailsState> {
  formData: IFinesMacAccountDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
