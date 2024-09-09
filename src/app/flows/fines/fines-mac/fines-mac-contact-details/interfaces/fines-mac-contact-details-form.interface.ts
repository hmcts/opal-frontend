import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacContactDetailsState } from '../interfaces/fines-mac-contact-details-state.interface';
import { FinesMacStatus } from '../../types';

export interface IFinesMacContactDetailsForm extends IAbstractFormBaseForm<IFinesMacContactDetailsState> {
  formData: IFinesMacContactDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
