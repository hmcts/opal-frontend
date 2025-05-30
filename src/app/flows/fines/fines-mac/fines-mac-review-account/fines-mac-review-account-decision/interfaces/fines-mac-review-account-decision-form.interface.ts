import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacReviewAccountDecisionState } from './fines-mac-review-account-decision-state.interface';

export interface IFinesMacReviewAccountDecisionForm extends IAbstractFormBaseForm<IFinesMacReviewAccountDecisionState> {
  formData: IFinesMacReviewAccountDecisionState;
  nestedFlow: boolean;
}
