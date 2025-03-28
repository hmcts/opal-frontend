import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract';
import { IFinesMacCompanyDetailsState } from '../interfaces/fines-mac-company-details-state.interface';

export interface IFinesMacCompanyDetailsForm extends IAbstractFormBaseForm<IFinesMacCompanyDetailsState> {
  formData: IFinesMacCompanyDetailsState;
  nestedFlow: boolean;
}
