import { IAbstractFormBaseForm } from '@interfaces/components/abstract';
import { IFinesMacCompanyDetailsState } from '../interfaces';

export interface IFinesMacCompanyDetailsForm extends IAbstractFormBaseForm<IFinesMacCompanyDetailsState> {
  formData: IFinesMacCompanyDetailsState;
  nestedFlow: boolean;
}
