import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacParentGuardianDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  VehicleMake: IAbstractFormBaseFieldError;
  VehicleRegistrationMark: IAbstractFormBaseFieldError;
}
