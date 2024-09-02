import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacCourtDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  sending_court: IAbstractFormBaseFieldError;
  prosecutor_case_reference: IAbstractFormBaseFieldError;
  enforcing_court: IAbstractFormBaseFieldError;
}
