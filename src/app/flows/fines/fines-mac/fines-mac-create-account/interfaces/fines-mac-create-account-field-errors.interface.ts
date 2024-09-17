import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacCreateAccountFieldErrors extends IAbstractFormBaseFieldErrors {
  account_type: IAbstractFormBaseFieldError;
  fine_defendant_type: IAbstractFormBaseFieldError;
  fixed_penalty_defendant_type: IAbstractFormBaseFieldError;
  business_unit: IAbstractFormBaseFieldError;
}
