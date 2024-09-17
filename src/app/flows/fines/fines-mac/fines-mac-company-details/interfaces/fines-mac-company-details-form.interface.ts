import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacCompanyDetailsState } from '../interfaces/fines-mac-company-details-state.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';

export interface IFinesMacCompanyDetailsForm extends IAbstractFormBaseForm<IFinesMacCompanyDetailsState> {
  formData: IFinesMacCompanyDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
