import { IAbstractFieldError, IAbstractFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacCourtDetailsFieldErrors extends IAbstractFieldErrors {
  SendingCourt: IAbstractFieldError;
  ProsecutorCaseReference: IAbstractFieldError;
  EnforcingCourt: IAbstractFieldError;
}
