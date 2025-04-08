import { IAbstractFormBaseStatus } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesMacStatus extends IAbstractFormBaseStatus {
  NOT_PROVIDED: string;
  PROVIDED: string;
  INCOMPLETE: string;
}
