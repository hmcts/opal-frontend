import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacPersonalDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  Title: IAbstractFormBaseFieldError;
  Forenames: IAbstractFormBaseFieldError;
  Surname: IAbstractFormBaseFieldError;
  VehicleMake: IAbstractFormBaseFieldError;
  VehicleRegistrationMark: IAbstractFormBaseFieldError;
}
