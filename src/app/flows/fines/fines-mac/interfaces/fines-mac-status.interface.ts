import { IAbstractFormBaseStatus } from '@hmcts/opal-frontend-common/components/abstract';

export interface IFinesMacStatus extends IAbstractFormBaseStatus {
  NOT_PROVIDED: string;
  PROVIDED: string;
  INCOMPLETE: string;
}
