import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacCourtDetailsState } from '../interfaces/fines-mac-court-details-state.interface';

export interface IFinesMacCourtDetailsForm extends IAbstractFormBaseForm<IFinesMacCourtDetailsState> {
  formData: IFinesMacCourtDetailsState;
  nestedFlow: boolean;
}
