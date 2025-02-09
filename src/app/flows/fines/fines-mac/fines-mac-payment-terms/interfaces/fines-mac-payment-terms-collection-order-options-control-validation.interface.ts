import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

interface IFinesMacPaymentTermsCollectionOrderOptionsFieldsAddRemove {
  fieldsToAdd: IAbstractFormArrayControlValidation[];
  fieldsToRemove: IAbstractFormArrayControlValidation[];
}

export interface IFinesMacPaymentTermsCollectionOrderOptionsControlValidation {
  true: IFinesMacPaymentTermsCollectionOrderOptionsFieldsAddRemove;
  false: IFinesMacPaymentTermsCollectionOrderOptionsFieldsAddRemove;
}
