import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacCourtDetailsState } from '../interfaces/fines-mac-court-details-state.interface';
import { FinesMacStatus } from '../../types';

export interface IFinesMacCourtDetailsForm extends IAbstractFormBaseForm<IFinesMacCourtDetailsState> {
  formData: IFinesMacCourtDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
