import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacCourtDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  sending_court: IAbstractFormBaseFieldError;
  prosecutor_case_reference: IAbstractFormBaseFieldError;
  enforcing_court: IAbstractFormBaseFieldError;
}
