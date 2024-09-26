import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacCourtDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_court_details_sending_court: IAbstractFormBaseFieldError;
  fm_court_details_prosecutor_case_reference: IAbstractFormBaseFieldError;
  fm_court_details_enforcing_court: IAbstractFormBaseFieldError;
}
