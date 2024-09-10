import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacVehicleDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  vehicle_make: IAbstractFormBaseFieldError;
  vehicle_registration_mark: IAbstractFormBaseFieldError;
}
