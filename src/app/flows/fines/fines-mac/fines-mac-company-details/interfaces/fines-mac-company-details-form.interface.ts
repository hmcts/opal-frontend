import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacCompanyDetailsState } from '../interfaces/fines-mac-company-details-state.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';
import { IFinesMacFormState } from '../../interfaces/fines-mac-form-state';

export interface IFinesMacCompanyDetailsForm extends IAbstractFormBaseForm<IFinesMacFormState> {
  formData: IFinesMacFormState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
