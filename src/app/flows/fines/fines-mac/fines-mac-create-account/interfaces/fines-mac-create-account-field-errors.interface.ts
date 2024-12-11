import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacCreateAccountFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_create_account_account_type: IAbstractFormBaseFieldError;
  fm_create_account_fine_defendant_type: IAbstractFormBaseFieldError;
  fm_create_account_fixed_penalty_defendant_type: IAbstractFormBaseFieldError;
  fm_create_account_business_unit_id: IAbstractFormBaseFieldError;
}
