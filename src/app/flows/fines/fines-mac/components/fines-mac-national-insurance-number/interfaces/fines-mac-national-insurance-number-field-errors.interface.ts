import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacNationalInsuranceNumberFieldErrors extends IAbstractFormBaseFieldErrors {
  national_insurance_number: IAbstractFormBaseFieldError;
}
