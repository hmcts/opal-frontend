import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseFieldError,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesMacReviewAccountDecisionFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_review_account_decision: IAbstractFormBaseFieldError;
  fm_review_account_decision_reason: IAbstractFormBaseFieldError;
}
