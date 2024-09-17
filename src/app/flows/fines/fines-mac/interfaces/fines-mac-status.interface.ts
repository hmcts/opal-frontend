import { IAbstractFormBaseStatus } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-status.interface';

export interface IFinesMacStatus extends IAbstractFormBaseStatus {
  NOT_PROVIDED: string;
  PROVIDED: string;
  INCOMPLETE: string;
}
