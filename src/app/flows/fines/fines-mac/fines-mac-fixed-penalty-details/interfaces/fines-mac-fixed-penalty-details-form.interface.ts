import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacFixedPenaltyDetailsState } from './fines-mac-fixed-penalty-details-state.interface';

export interface IFinesMacFixedPenaltyDetailsForm extends IAbstractFormBaseForm<IFinesMacFixedPenaltyDetailsState> {
  formData: IFinesMacFixedPenaltyDetailsState;
  nestedFlow: boolean;
}
