import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesMciCreateTillPayerDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  payerType: IAbstractFormBaseFieldErrors[string];
  firstNames: IAbstractFormBaseFieldErrors[string];
  lastName: IAbstractFormBaseFieldErrors[string];
  companyName: IAbstractFormBaseFieldErrors[string];
  addressLine1: IAbstractFormBaseFieldErrors[string];
  addressLine2: IAbstractFormBaseFieldErrors[string];
  addressLine3: IAbstractFormBaseFieldErrors[string];
  postcode: IAbstractFormBaseFieldErrors[string];
}
