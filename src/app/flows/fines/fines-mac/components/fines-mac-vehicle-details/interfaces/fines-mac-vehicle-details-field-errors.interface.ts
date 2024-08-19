import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacVehicleDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  VehicleMake: IAbstractFormBaseFieldError;
  VehicleRegistrationMark: IAbstractFormBaseFieldError;
}
