import {
  IAbstractFormBaseFieldErrors,
  IAbstractFormBaseFieldError,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesMacDeleteAccountConfirmationFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_delete_account_confirmation_reason: IAbstractFormBaseFieldError;
}
