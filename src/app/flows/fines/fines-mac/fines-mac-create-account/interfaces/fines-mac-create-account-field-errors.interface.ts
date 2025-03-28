import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract';

export interface IFinesMacCreateAccountFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_create_account_account_type: IAbstractFormBaseFieldError;
  fm_create_account_fine_defendant_type: IAbstractFormBaseFieldError;
  fm_create_account_fixed_penalty_defendant_type: IAbstractFormBaseFieldError;
  fm_create_account_business_unit_id: IAbstractFormBaseFieldError;
}
