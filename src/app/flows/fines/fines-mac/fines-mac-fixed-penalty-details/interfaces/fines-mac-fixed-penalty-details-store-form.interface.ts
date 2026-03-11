import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacFixedPenaltyDetailsStoreState } from './fines-mac-fixed-penalty-details-store-state.interface';

export interface IFinesMacFixedPenaltyDetailsStoreForm
  extends IAbstractFormBaseForm<IFinesMacFixedPenaltyDetailsStoreState> {
  formData: IFinesMacFixedPenaltyDetailsStoreState;
  nestedFlow: boolean;
}
