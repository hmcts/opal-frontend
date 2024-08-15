import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacCourtDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  SendingCourt: IAbstractFormBaseFieldError;
  ProsecutorCaseReference: IAbstractFormBaseFieldError;
  EnforcingCourt: IAbstractFormBaseFieldError;
}
