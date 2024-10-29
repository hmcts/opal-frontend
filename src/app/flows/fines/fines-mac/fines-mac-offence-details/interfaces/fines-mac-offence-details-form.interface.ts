import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';
import { IFinesMacOffenceDetailsState } from './fines-mac-offence-details-state.interface';
import { IFinesMacOffenceDetailsMinorCreditorForm } from '../fines-mac-offence-details-minor-creditor/interfaces/fines-mac-offence-details-minor-creditor-form.interface';

export interface IFinesMacOffenceDetailsForm extends IAbstractFormBaseForm<IFinesMacOffenceDetailsState> {
  formData: IFinesMacOffenceDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
  childFormData?: IFinesMacOffenceDetailsMinorCreditorForm[] | null;
}
