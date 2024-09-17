import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacVehicleDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  vehicle_make: IAbstractFormBaseFieldError;
  vehicle_registration_mark: IAbstractFormBaseFieldError;
}
