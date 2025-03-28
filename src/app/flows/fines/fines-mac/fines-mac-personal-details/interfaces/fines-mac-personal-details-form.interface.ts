import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract';
import { IFinesMacPersonalDetailsState } from '../interfaces/fines-mac-personal-details-state.interface';

export interface IFinesMacPersonalDetailsForm extends IAbstractFormBaseForm<IFinesMacPersonalDetailsState> {
  formData: IFinesMacPersonalDetailsState;
  nestedFlow: boolean;
}
