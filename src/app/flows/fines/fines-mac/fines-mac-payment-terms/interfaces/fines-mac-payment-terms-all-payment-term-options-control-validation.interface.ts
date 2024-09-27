import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

interface IFinesMacPaymentTermsPaymentTermFieldsAddRemove {
  fieldsToAdd: IAbstractFormArrayControlValidation[];
  fieldsToRemove: IAbstractFormArrayControlValidation[];
}

export interface IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation {
  payInFull: IFinesMacPaymentTermsPaymentTermFieldsAddRemove;
  instalmentsOnly: IFinesMacPaymentTermsPaymentTermFieldsAddRemove;
  lumpSumPlusInstalments: IFinesMacPaymentTermsPaymentTermFieldsAddRemove;
}
