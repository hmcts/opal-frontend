import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract';
import { IFinesMacParentGuardianDetailsState } from '../interfaces/fines-mac-parent-guardian-details-state.interface';

export interface IFinesMacParentGuardianDetailsForm extends IAbstractFormBaseForm<IFinesMacParentGuardianDetailsState> {
  formData: IFinesMacParentGuardianDetailsState;
  nestedFlow: boolean;
}
