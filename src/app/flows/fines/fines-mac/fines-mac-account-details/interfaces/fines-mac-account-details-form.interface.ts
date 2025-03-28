import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract';
import { IFinesMacAccountDetailsState } from './fines-mac-account-details-state.interface';

export interface IFinesMacAccountDetailsForm extends IAbstractFormBaseForm<IFinesMacAccountDetailsState> {
  formData: IFinesMacAccountDetailsState;
  nestedFlow: boolean;
}
