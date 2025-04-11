import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';

export interface IFinesMacOffenceDetailsCreditorOptionControlValidation {
  major: {
    fieldsToAdd: IAbstractFormArrayControlValidation[];
    fieldsToRemove: IAbstractFormArrayControlValidation[];
  };
  minor: {
    fieldsToAdd: IAbstractFormArrayControlValidation[];
    fieldsToRemove: IAbstractFormArrayControlValidation[];
  };
}
