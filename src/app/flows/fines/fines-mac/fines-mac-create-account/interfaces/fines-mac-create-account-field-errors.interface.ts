import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacCreateAccountFieldErrors extends IAbstractFormBaseFieldErrors {
  account_type: IAbstractFormBaseFieldError;
  fine_defendant_type: IAbstractFormBaseFieldError;
  fixed_penalty_defendant_type: IAbstractFormBaseFieldError;
  business_unit: IAbstractFormBaseFieldError;
}
