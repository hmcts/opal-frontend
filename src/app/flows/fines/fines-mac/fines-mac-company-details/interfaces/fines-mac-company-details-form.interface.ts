import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacCompanyDetailsState } from '../interfaces/fines-mac-company-details-state.interface';
import { FinesMacStatus } from '../../types/fines-mac-status.type';

export interface IFinesMacCompanyDetailsForm extends IAbstractFormBaseForm<IFinesMacCompanyDetailsState> {
  formData: IFinesMacCompanyDetailsState;
  nestedFlow: boolean;
  status?: FinesMacStatus | null;
}
