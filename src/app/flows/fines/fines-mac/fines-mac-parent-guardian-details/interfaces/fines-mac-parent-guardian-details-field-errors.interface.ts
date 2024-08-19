import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacParentGuardianDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  Forenames: IAbstractFormBaseFieldError;
  Surname: IAbstractFormBaseFieldError;
  VehicleMake: IAbstractFormBaseFieldError;
  VehicleRegistrationMark: IAbstractFormBaseFieldError;
}
