import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacDeleteAccountConfirmationState } from './fines-mac-delete-account-confirmation-state.interface';

export interface IFinesMacDeleteAccountConfirmationForm
  extends IAbstractFormBaseForm<IFinesMacDeleteAccountConfirmationState> {
  formData: IFinesMacDeleteAccountConfirmationState;
  nestedFlow: boolean;
}
