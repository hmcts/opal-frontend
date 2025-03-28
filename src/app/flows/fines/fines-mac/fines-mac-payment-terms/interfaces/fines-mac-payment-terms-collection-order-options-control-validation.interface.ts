import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract';

interface IFinesMacPaymentTermsCollectionOrderOptionsFieldsAddRemove {
  fieldsToAdd: IAbstractFormArrayControlValidation[];
  fieldsToRemove: IAbstractFormArrayControlValidation[];
}

export interface IFinesMacPaymentTermsCollectionOrderOptionsControlValidation {
  true: IFinesMacPaymentTermsCollectionOrderOptionsFieldsAddRemove;
  false: IFinesMacPaymentTermsCollectionOrderOptionsFieldsAddRemove;
}
