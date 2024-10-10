import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

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
