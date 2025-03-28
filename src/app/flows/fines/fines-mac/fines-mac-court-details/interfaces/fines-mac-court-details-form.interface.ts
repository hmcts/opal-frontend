import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract';
import { IFinesMacCourtDetailsState } from '../interfaces/fines-mac-court-details-state.interface';

export interface IFinesMacCourtDetailsForm extends IAbstractFormBaseForm<IFinesMacCourtDetailsState> {
  formData: IFinesMacCourtDetailsState;
  nestedFlow: boolean;
}
