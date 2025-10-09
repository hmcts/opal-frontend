import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesSaSearchAccountFormMajorCreditorsFieldErrors extends IAbstractFormBaseFieldErrors {
  fsa_search_account_major_creditors_major_creditor_id: IAbstractFormBaseFieldError;
}
