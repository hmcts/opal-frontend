import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacFixedPenaltyOffenceDetailsState } from './fines-mac-fixed-penalty-offence-details-state.interface';

export interface IFinesMacFixedPenaltyOffenceDetailsForm
  extends IAbstractFormBaseForm<IFinesMacFixedPenaltyOffenceDetailsState> {
  formData: IFinesMacFixedPenaltyOffenceDetailsState;
  nestedFlow: boolean;
}
