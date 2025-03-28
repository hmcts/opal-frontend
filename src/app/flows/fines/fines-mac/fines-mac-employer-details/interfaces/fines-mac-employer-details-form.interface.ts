import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract';
import { IFinesMacEmployerDetailsState } from '../interfaces/fines-mac-employer-details-state.interface';

export interface IFinesMacEmployerDetailsForm extends IAbstractFormBaseForm<IFinesMacEmployerDetailsState> {
  formData: IFinesMacEmployerDetailsState;
  nestedFlow: boolean;
}
