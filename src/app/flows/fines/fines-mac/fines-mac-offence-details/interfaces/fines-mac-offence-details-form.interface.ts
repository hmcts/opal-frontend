import { FinesMacStatus } from '../../types/fines-mac-status.type';
import { IFinesMacOffenceDetailsState } from './fines-mac-offence-details-state.interface';

export interface IFinesMacOffenceDetailsForm {
  formData: IFinesMacOffenceDetailsState;
  nestedFlow: boolean;
  status: FinesMacStatus;
}
