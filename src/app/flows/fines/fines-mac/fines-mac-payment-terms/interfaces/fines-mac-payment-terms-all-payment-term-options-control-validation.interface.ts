import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';

interface IFinesMacPaymentTermsPaymentTermFieldsAddRemove {
  fieldsToAdd: IAbstractFormArrayControlValidation[];
  fieldsToRemove: IAbstractFormArrayControlValidation[];
}

export interface IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation {
  payInFull: IFinesMacPaymentTermsPaymentTermFieldsAddRemove;
  instalmentsOnly: IFinesMacPaymentTermsPaymentTermFieldsAddRemove;
  lumpSumPlusInstalments: IFinesMacPaymentTermsPaymentTermFieldsAddRemove;
}
