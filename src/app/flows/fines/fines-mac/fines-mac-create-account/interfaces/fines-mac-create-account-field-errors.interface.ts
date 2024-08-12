import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacCreateAccountFieldErrors extends IAbstractFormBaseFieldErrors {
  AccountType: IAbstractFormBaseFieldError;
  FineDefendantType: IAbstractFormBaseFieldError;
  FixedPenaltyDefendantType: IAbstractFormBaseFieldError;
  BusinessUnit: IAbstractFormBaseFieldError;
}
