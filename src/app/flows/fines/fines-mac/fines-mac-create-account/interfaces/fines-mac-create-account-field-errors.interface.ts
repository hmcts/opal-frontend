import { IAbstractFieldError, IAbstractFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacCreateAccountFieldErrors extends IAbstractFieldErrors {
  AccountType: IAbstractFieldError;
  FineDefendantType: IAbstractFieldError;
  FixedPenaltyDefendantType: IAbstractFieldError;
  BusinessUnit: IAbstractFieldError;
}
